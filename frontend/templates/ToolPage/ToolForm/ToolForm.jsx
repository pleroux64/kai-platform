import { useContext } from 'react';

import { Help } from '@mui/icons-material';
import { Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { FormContainer } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';

import useWatchFields from '@/hooks/useWatchFields';

import GradientOutlinedButton from '@/components/GradientOutlinedButton';
import PrimaryFileUpload from '@/components/PrimaryFileUpload';
import PrimarySelectorInput from '@/components/PrimarySelectorInput';
import PrimaryTextFieldInput from '@/components/PrimaryTextFieldInput';

import { INPUT_TYPES } from '@/constants/inputs';
import ALERT_COLORS from '@/constants/notification';

import styles from './styles';

import { AuthContext } from '@/providers/GlobalProvider';
import {
  setCommunicatorLoading,
  setFormOpen,
  setPrompt,
  setResponse,
} from '@/redux/slices/toolsSlice';
import submitPrompt from '@/services/tools/submitPrompt';

// Define a mapping for logos based on tool IDs
const toolLogos = {
  GEMINI_DYNAMO: '@/public/flash-cards.png', // Replace with actual path
  GEMINI_QUIZIFY: '/path/to/multiple-choice-logo.png', // Replace with actual path
  // Add more tool ID mappings as needed
};

const toolImg = {
  '0': {
    backgroundImgURL:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Quizify.png?alt=media&token=d1255f27-b1a1-444e-b96a-4a3ac559237d',
    description:
      'Create a multiple choice quiz based on any topic, standard(s), and pdf files!',
    id: '0',
    inputs: [
      {
        label: 'Topic',
        name: 'topic',
        placeholder: 'Enter Topic',
        type: 'text',
      },
      {
        label: 'Number of Questions',
        name: 'num_questions',
        placeholder: 'Enter No. Of Questions',
        type: 'number',
      },
      {
        label: 'Upload PDF files',
        name: 'files',
        type: 'file',
      },
    ],
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/QuizifyLogo.png?alt=media&token=9bf1d066-fba4-4063-9640-ef732e237d31',
    name: 'Multiple Choice Quiz',
  },
  '1': {
    backgroundImgURL:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Dynamo.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
    description: 'Creates flash cards from a youtube video.',
    id: '1',
    inputs: [
      {
        label: 'Youtube Video URL',
        name: 'youtube_url',
        placeholder: 'Paste URL',
        type: 'text',
        tooltip: 'Please note that the video should not exceed 10 minutes.',
      },
    ],
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/YoutubeLogo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
    name: 'FlashCards from Youtube',
  },
};

const ToolForm = ({ id, inputs }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { handleOpenSnackBar } = useContext(AuthContext);
  const { communicatorLoading } = useSelector((state) => state.tools);
  const { data: userData } = useSelector((state) => state.user);

  const { register, control, handleSubmit, getValues, setValue, errors } =
    useWatchFields([]);

  // Determine the logo based on tool ID
  const logoUrl = toolLogos[id] || '/path/to/default-logo.png'; // Use a default logo if no match is found

  const handleSubmitMultiForm = async (values) => {
    try {
      const { files, ...toolData } = values;

      dispatch(setResponse(null));

      const updateData = Object.entries(toolData).map(([name, value]) => ({
        name,
        value,
      }));
      dispatch(setPrompt(values));
      dispatch(setCommunicatorLoading(true));

      const response = await submitPrompt(
        {
          tool_data: { tool_id: id, inputs: updateData },
          type: 'tool',
          user: {
            id: userData?.id,
            fullName: userData?.fullName,
            email: userData?.email,
          },
        },
        files
      );

      if (response.success) {
        const aiResponseData = response.data;
        dispatch(setResponse(aiResponseData));

        // Construct the document to be saved
        const documentData = {
          title: toolData.title || 'Generated Title',
          content: toolData.content || 'Summary of the response',
          response: aiResponseData, // The detailed AI response
          userId: userData?.id,
          timestamp: new Date(),
          toolId: id, // The tool ID used to generate this response
          promptData: updateData, // The user's input data
          logo: logoUrl, // The selected logo URL
        };

        // Save the AI response to the 'outputs' collection
        const db = getFirestore();
        await addDoc(collection(db, 'outputs'), documentData);

        // Close the form and stop the loading indicator
        dispatch(setFormOpen(false));
        dispatch(setCommunicatorLoading(false));
      } else {
        throw new Error(response.message || 'Failed to process AI response');
      }
    } catch (error) {
      dispatch(setCommunicatorLoading(false));
      handleOpenSnackBar(
        ALERT_COLORS.ERROR,
        error?.message || 'Couldn\u0027t send prompt'
      );
    }
  };

  const renderIcon = () => {
    if (id === 'Quizify') {
      const { backgroundImgURL } = toolImg[0].backgroundImgURL;
      return (
        <div style={{ backgroundImage: `url(${backgroundImgURL})` }}>
          <img src={toolImg[0].logo} />
        </div>
      );
    }
    const { backgroundImgURL } = toolImg[1].backgroundImgURL;
    return (
      <div style={{ backgroundImage: `url(${backgroundImgURL})` }}>
        <img src={toolImg[1].logo} />
      </div>
    );
  };

  const renderTextInput = (inputProps) => {
    const { name: inputName, placeholder, tooltip, label } = inputProps;
    const renderLabel = () => (
      <Grid {...styles.textFieldLabelGridProps}>
        <Typography {...styles.labelProps(errors?.[inputName])}>
          {label}
        </Typography>
        {tooltip && (
          <Tooltip placement="top" title={tooltip} sx={{ ml: 1 }}>
            <Help />
          </Tooltip>
        )}
      </Grid>
    );

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimaryTextFieldInput
          id={inputName}
          name={inputName}
          title={renderLabel()}
          error={errors?.[inputName]}
          control={control}
          placeholder={placeholder}
          helperText={errors?.[inputName]?.message}
          validation={{
            required: 'Field is required',
          }}
          ref={register}
        />
      </Grid>
    );
  };

  const renderSelectorInput = (inputProps) => {
    const { name: inputName, label, placeholder, max = 10 } = inputProps;

    const renderLabel = () => (
      <Grid {...styles.labelGridProps}>
        <Typography {...styles.labelProps(errors?.[inputName])}>
          {label}
        </Typography>
      </Grid>
    );

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimarySelectorInput
          id={inputName}
          name={inputName}
          label={renderLabel()}
          displayEmpty
          color="purple"
          bgColor="#ffffff"
          placeholder={placeholder}
          error={errors?.[inputName]}
          menuList={new Array(max)
            .fill()
            ?.map((item, index) => ({ id: index + 1, label: index + 1 }))}
          helperText={errors?.[inputName]?.message}
          control={control}
          ref={register}
          extraInputProps={{
            color: 'black',
          }}
          validation={{
            required: 'Please select an option.',
          }}
        />
      </Grid>
    );
  };

  const renderFileUpload = (inputProps) => {
    const { name: inputName, label } = inputProps;

    return (
      <Grid key={inputName} {...styles.inputGridProps}>
        <PrimaryFileUpload
          id={inputName}
          name={inputName}
          multiple
          placeholder="Choose Files to Upload"
          label={label}
          error={errors?.[inputName]}
          helperText={errors?.[inputName]?.message}
          color="purple"
          bgColor="#ffffff"
          control={control}
          getValues={getValues}
          ref={register}
          showChips
          showCheckbox
          displayEmpty
          setValue={setValue}
          validation={{
            required: 'Please upload a file.',
            validate: {
              lessThanThree: (v) =>
                parseInt(v?.length, 10) < 10 || 'Should be less than 3 files',
            },
          }}
        />
      </Grid>
    );
  };

  const renderActionButtons = () => (
    <Grid mt={4} {...styles.actionButtonGridProps}>
      <GradientOutlinedButton
        id="submitButton"
        bgcolor={theme.palette.Common.White['100p']}
        text="Generate"
        textColor={theme.palette.Common.White['100p']}
        loading={communicatorLoading}
        onHoverTextColor={theme.palette.Background.purple}
        type="submit"
        inverted
        {...styles.submitButtonProps}
      />
    </Grid>
  );

  const renderInput = (inputProps) => {
    switch (inputProps?.type) {
      case INPUT_TYPES.TEXT:
        return renderTextInput(inputProps);
      case INPUT_TYPES.NUMBER:
        return renderSelectorInput(inputProps);
      case INPUT_TYPES.FILE:
        return renderFileUpload(inputProps);
      default:
        return null;
    }
  };

  return (
    <FormContainer
      FormProps={{
        id: 'tool-form',
      }}
      onSuccess={handleSubmit(handleSubmitMultiForm)}
    >
      <Grid {...styles.formProps}>
        <Grid {...styles.mainContentGridProps}>
          {inputs?.map((input) => renderInput(input))}
        </Grid>
        {renderActionButtons()}
      </Grid>
    </FormContainer>
  );
};

export default ToolForm;
