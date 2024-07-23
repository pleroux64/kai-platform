import { Alert, Snackbar } from '@mui/material';

import ALERT_COLORS from '@/constants/notification';

import styles from './styles';

/**
 * Renders a Snackbar component with alert messages.
 *
 * @return {ReactElement} The rendered Snackbar component.
 */
const SnackBar = (props) => {
  const { open, handleClose, message, severity } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      color={ALERT_COLORS[severity]}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={severity} onClose={handleClose} style={styles.alert}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
