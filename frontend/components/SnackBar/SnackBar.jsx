import { Alert, Snackbar, Typography } from '@mui/material';

import styles from './styles';

/**
 * Renders a Snackbar component with alert messages.
 *
 * @return {ReactElement} The rendered Snackbar component.
 */
const SnackBar = (props) => {
  const { open, handleClose, message, severity, title } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={handleClose} style={styles.alert}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
