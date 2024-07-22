import { useContext, useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { Grid, Typography, useTheme } from '@mui/material';
import { FormContainer } from 'react-hook-form-mui';

import useWatchFields from '@/hooks/useWatchFields';

import AuthTextField from '@/components/AuthTextField';

import GradientOutlinedButton from '@/components/GradientOutlinedButton';

import { AUTH_STEPS, VALIDATION_STATES } from '@/constants/auth';
import ALERT_COLORS from '@/constants/notification';

import styles from './styles';

import sharedStyles from '@/styles/shared/sharedStyles';

import { AuthContext } from '@/providers/GlobalProvider';
import AUTH_REGEX from '@/regex/auth';
import { signUp } from '@/services/user/signUp';
import { validatePassword } from '@/utils/AuthUtils';

const DEFAULT_FORM_VALUES = {
  email: '',
  fullName: '',
  password: '',
  reEnterPassword: '',
};

const DEFAULT_ERR_STATE = {
  email: false,
  fullName: false,
  password: false,
  reEnterPassword: false,
};

const WATCH_FIELDS = [
  {
    fieldName: 'password',
    regexPattern: AUTH_REGEX.password.regex,
  },
  {
    fieldName: 'reEnterPassword',
    regexPattern: AUTH_REGEX.password.regex,
  },
  {
    fieldName: 'email',
    regexPattern: AUTH_REGEX.email.regex,
  },
  {
    fieldName: 'fullName',
    regexPattern: AUTH_REGEX.fullName.regex,
  },
];

/**
 * Sign up form component that handles user registration.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.step - The current step in the sign-up process.
 * @param {function} props.setStep - A function to update the current step.
 * @param {function} props.handleSwitch - A function to switch between sign-up and verify email view.
 * @return {JSX.Element} Returns Sign-Up Form.
 */
const SignUpForm = (props) => {
  const { step, setStep, setEmail, handleSwitch } = props;

  const theme = useTheme();

  const [error, setError] = useState(DEFAULT_ERR_STATE);
  const [loading, setLoading] = useState(false);

  const { handleOpenSnackBar } = useContext(AuthContext);

  const { register, control, fieldStates } = useWatchFields(WATCH_FIELDS);
  const { email, fullName, password, reEnterPassword } = fieldStates;

  const passwordMatch = password.value === reEnterPassword.value;

  let emailHeaderText = 'Email Address'; // Default helper text is the label
  let emailErrorText = null; // Initially no info text
  const passwordHeaderText = 'Password';
  let passwordErrorText = null; // Initially no info text for password
  const reEnterHeaderText = 'Re-enter Password';
  let reEnterErrorText = null;

  const setReEnterPasswordStatus = () => {
    if (passwordMatch && password.valid && reEnterPassword.valid) {
      return VALIDATION_STATES.SUCCESS;
    }

    if (password.value === '') return VALIDATION_STATES.DEFAULT;

    return VALIDATION_STATES.ERROR;
  };

  const submitButtonText = () => {
    if (step === AUTH_STEPS.EMAIL) {
      return 'Continue';
    }
    return 'Sign Up';
  };

  const handleSubmit = async () => {
    const isEmailStep = step === AUTH_STEPS.EMAIL;

    setError(DEFAULT_ERR_STATE);

    if (isEmailStep) {
      if (fullName.valid && email.valid) {
        setStep(AUTH_STEPS.PASSWORD);
        return;
      }

      if (!fullName.valid && !email.valid) {
        setError({
          ...error,
          fullName: { message: 'Full name is required' },
          email: { message: 'Email address is required' },
        });
        return;
      }

      if (!fullName.valid) {
        setError({
          ...error,
          fullName: { message: 'Full name is required' },
        });
        return;
      }

      if (!email.valid) {
        setError({
          ...error,
          email: { message: 'Email address is required' },
        });
        return;
      }
    }

    const isPasswordValid = validatePassword(
      { reEnterPassword: reEnterPassword.value, password: password.value },
      setError
    );

    if (isPasswordValid) {
      setLoading(true);

      try {
        await signUp(email.value, password.value, fullName.value);
        handleOpenSnackBar(
          'Sign Up Successful',
          ALERT_COLORS.SUCCESS,
          'Account created successfully'
        );

        setEmail(email.value);
        handleSwitch();
      } catch (err) {
        handleOpenSnackBar('Sign Up Failed', ALERT_COLORS.ERROR, err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderEmailInput = () => {
    if (step !== AUTH_STEPS.EMAIL) {
      return null;
    }

    if (!email.valid && email.value) {
      emailHeaderText = ''; // Clear helper text when invalid to make room for info icon
      emailErrorText = 'Invalid Email Address'; // Display info text when email is invalid
    }

    return (
      <>
        <AuthTextField
          id="email"
          name="email"
          label="Email Address"
          placeholderText="Email address"
          error={!!error.email}
          helperText={emailHeaderText}
          state={email.status}
          control={control}
          ref={register}
          focused
        />
        {emailErrorText && (
          <Grid container alignItems="center" spacing={1} marginTop={-5}>
            <Grid item>
              <InfoIcon color="error" />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="error" fontSize="small">
                {emailErrorText}
              </Typography>
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  const renderFullNameInput = () => {
    if (step !== AUTH_STEPS.EMAIL) {
      return null;
    }

    return (
      <AuthTextField
        id="fullName"
        name="fullName"
        label="Full Name"
        placeholderText="Full name"
        error={!!error.fullName}
        helperText={
          !fullName.valid && fullName.value
            ? AUTH_REGEX.fullName.message
            : error.fullName?.message
        }
        state={fullName.status}
        control={control}
        ref={register}
        focused
      />
    );
  };

  const renderPasswordAndConfirmPasswordInputs = () => {
    if (step === AUTH_STEPS.EMAIL) return null;

    if (!password.valid && password.value) {
      passwordErrorText = AUTH_REGEX.password.message; // Display info text when password is invalid
    }
    if (!passwordMatch) {
      reEnterErrorText = 'Passwords do not match';
    }

    return (
      <>
        <AuthTextField
          id="password"
          name="password"
          label="Password"
          placeholderText="Enter Password"
          error={!!error.password}
          helperText={passwordHeaderText}
          state={password.status}
          control={control}
          ref={register}
          isPasswordField
          focused
        />
        {passwordErrorText && (
          <Grid
            container
            alignItems="center"
            spacing={1}
            marginTop={-5}
            marginBottom={-1}
          >
            <Grid item>
              <InfoIcon color="error" />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="error" fontSize="small">
                {passwordErrorText}
              </Typography>
            </Grid>
          </Grid>
        )}
        <AuthTextField
          id="reEnterPassword"
          name="reEnterPassword"
          label="Re-Enter Password"
          placeholderText="Re-Enter Password"
          error={!!error.reEnterPassword}
          helperText={reEnterHeaderText}
          state={setReEnterPasswordStatus()}
          control={control}
          ref={register}
          isPasswordField
          focused
        />
        {reEnterErrorText && (
          <Grid
            container
            alignItems="center"
            spacing={1}
            marginTop={-5}
            marginBottom={-4}
          >
            <Grid item>
              <InfoIcon color="error" />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="error" fontSize="small">
                {reEnterErrorText}
              </Typography>
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  const renderSubmitButton = () => {
    return (
      <GradientOutlinedButton
        bgcolor={theme.palette.Dark_Colors.Dark[1]}
        loading={step === AUTH_STEPS.PASSWORD && loading}
        textColor={theme.palette.Common.White['100p']}
        clickHandler={handleSubmit}
        text={submitButtonText()}
        {...styles.submitButtonProps}
      />
    );
  };

  return (
    <FormContainer defaultValues={DEFAULT_FORM_VALUES} onSuccess={handleSubmit}>
      <Grid {...sharedStyles.formGridProps}>
        {renderEmailInput()}
        {renderFullNameInput()}
        {renderPasswordAndConfirmPasswordInputs()}
        {renderSubmitButton()}
      </Grid>
    </FormContainer>
  );
};

export default SignUpForm;
