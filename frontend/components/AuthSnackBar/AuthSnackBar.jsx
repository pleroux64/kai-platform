import { Alert, Snackbar, Typography } from '@mui/material'

import { useSelector } from 'react-redux'

import styles from './styles'

const AuthSnackBar = (props) => {
  const { open, handleClose, title } = props
  const user = useSelector((state) => state.user.data?.fullName)

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
    >
      <Alert
        icon={false}
        onClose={handleClose}
        sx={{ backgroundColor: '#E6DBFF', color: 'black', width: '324px' }}
      >
        <Typography {...styles.titleProps}>{title}</Typography>
        <Typography {...styles.messageProps}>
          👋Welcome to KAI! {user}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default AuthSnackBar
