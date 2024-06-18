import React, { useContext } from 'react';

import { Help } from '@mui/icons-material';
import { Grid, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import Image from 'next/image'; // Import the Next.js Image component
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

// Define the toolImg object with configurations for each tool
const toolImg = {
  GEMINI_DYNAMO: {
    backgroundImgURL: '@/public/dynamo-background.png', // Replace with actual path
    description: 'Creates flash cards from a YouTube video.',
    id: 'GEMINI_DYNAMO',
    inputs: [
      {
        label: 'YouTube Video URL',
        name: 'youtube_url',
        placeholder: 'Paste URL',
        type: 'text',
        tooltip: 'Please note that the video should not exceed 10 minutes.',
      },
    ],
    logo: '@/public/flash-cards.png', // Replace with actual path
    name: 'FlashCards from YouTube',
  },
  GEMINI_QUIZIFY: {
    backgroundImgURL: '@/public/quizify-background.png', // Replace with actual path
    description:
      'Create a multiple choice quiz based on any topic, standard(s), and PDF files!',
    id: 'GEMINI_QUIZIFY',
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
      { label: 'Upload PDF files', name: 'files', type: 'file' },
    ],
    logo: '@/public/multiple-choice-logo.png', // Replace with actual path
    name: 'Multiple Choice Quiz',
  },
  // Add more tools as needed
};

const ToolForm = ({ id, inputs }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { handleOpenSnackBar } = useContext(AuthContext);
  const { communicatorLoading } = useSelector((state) => state.tools);
  const { data: userData } = useSelector((state) => state.user);

  const { register, control, handleSubmit, getValues, setValue, errors } =
    useWatchFields([]);

  // Function to handle form submission
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

        const documentData = {
          title: toolData.title || 'Generated Title',
          content: toolData.content || 'Summary of the response',
          questions: aiResponseData, // The detailed AI response
          userId: userData?.id,
          timestamp: new Date(),
          toolId: id,
          promptData: updateData,
          logo: toolImg[id]?.logo, // Use the logo from toolImg based on the tool ID
        };

        const db = getFirestore();
        await addDoc(collection(db, 'outputs'), documentData);

        dispatch(setFormOpen(false));
        dispatch(setCommunicatorLoading(false));
      } else {
        throw new Error(response.message || 'Failed to process AI response');
      }
    } catch (error) {
      dispatch(setCommunicatorLoading(false));
      handleOpenSnackBar(
        ALERT_COLORS.ERROR,
        error?.message || 'Could not send prompt'
      );
    }
  };

  // Function to render the tool icon
  const renderIcon = () => {
    const tool = toolImg[id];
    if (!tool) return null; // Return null if the tool ID is not found

    return (
      <div
        style={{
          backgroundImage: `url(${tool.backgroundImgURL})`,
          position: 'relative',
          width: '100%',
          height: '200px',
        }}
      >
        <Image
          src={tool.logo}
          alt={`${tool.name} logo`}
          layout="fill"
          objectFit="contain"
        />
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
        {/* Render the tool icon */}
        {renderIcon()}
        <Grid {...styles.mainContentGridProps}>
          {inputs?.map((input) => renderInput(input))}
        </Grid>
        {renderActionButtons()}
      </Grid>
    </FormContainer>
  );
};

export default ToolForm;
