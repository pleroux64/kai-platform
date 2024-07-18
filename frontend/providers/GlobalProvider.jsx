import { createContext, useEffect, useMemo, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { Provider, useDispatch } from 'react-redux'

import useRedirect from '@/hooks/useRedirect'

import AuthSnackBar from '@/components/AuthSnackBar'
import SnackBar from '@/components/SnackBar'

import { setLoading, setUser } from '@/redux/slices/authSlice'
import { setUserData } from '@/redux/slices/userSlice'
import store, { auth, firestore, functions } from '@/redux/store'

const AuthContext = createContext()

/**
 * Creates an authentication provider to observe authentication state changes.
 *
 * @param {Object} children - The child components to render.
 * @return {Object} The child components wrapped in the authentication provider.
 */
const AuthProvider = (props) => {
  const { children } = props
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState('success')
  const [message, setMessage] = useState('Default Message')
  const [authSnackBarTitle, setAuthSnackBarTitle] = useState('')
  const [activeSnackBar, setActiveSnackBar] = useState('') // Set active snackbar

  const handleOpenSnackBar = (newSeverity, newMessage) => {
    setActiveSnackBar('openSnackBar')
    setSeverity(newSeverity)
    setMessage(newMessage)
    setOpen(true)
  }

  const handleAuthSnackBar = (signUp) => {
    setActiveSnackBar('authSnackBar')
    setAuthSnackBarTitle(signUp ? 'Sign Up Successful!' : 'Log In Successful!')
    setOpen(true)
  }

  const memoizedValue = useMemo(() => {
    return {
      handleOpenSnackBar,
      handleAuthSnackBar,
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return null

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get auth user claims
        const { claims } = await user.getIdTokenResult(true)
        return dispatch(setUser({ ...user.toJSON(), claims }))
      }

      dispatch(setLoading(false))
      dispatch(setUser(false))
      return dispatch(setUserData(false))
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useRedirect(firestore, functions, handleOpenSnackBar, handleAuthSnackBar)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
      {activeSnackBar === 'openSnackBar' ? (
        <SnackBar
          open={open}
          severity={severity}
          message={message}
          handleClose={handleClose}
        />
      ) : (
        <AuthSnackBar
          open={open}
          title={authSnackBarTitle}
          handleClose={handleClose}
        />
      )}
    </AuthContext.Provider>
  )
}

/**
 * Creates a global provider component that wraps the entire app and provides access to the Redux store and authentication.
 *
 * @param {Object} props - The properties to be passed to the component.
 * @param {ReactNode} props.children - The child elements to be rendered within the provider.
 * @return {JSX.Element} The provider component.
 */
const GlobalProvider = (props) => {
  const { children } = props
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}

export { AuthContext }

export default GlobalProvider
