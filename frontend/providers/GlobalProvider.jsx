import { createContext, useEffect, useMemo, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { Provider, useDispatch } from 'react-redux';

import useRedirect from '@/hooks/useRedirect';

import SnackBar from '@/components/SnackBar';

import { setLoading, setUser } from '@/redux/slices/authSlice';
import { setUserData } from '@/redux/slices/userSlice';
import store, { auth, firestore, functions } from '@/redux/store';

const AuthContext = createContext();

const AuthProvider = (props) => {
  const { children } = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('Default Message');
  const [title, setTitle] = useState('');

  const handleOpenSnackBar = (newTitle, newSeverity, newMessage) => {
    setTitle(newTitle);
    setSeverity(newSeverity);
    setMessage(newMessage);
    setOpen(true);
  };

  const memoizedValue = useMemo(() => {
    return {
      handleOpenSnackBar,
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { claims } = await user.getIdTokenResult(true);
        return dispatch(setUser({ ...user.toJSON(), claims }));
      }

      dispatch(setLoading(false));
      dispatch(setUser(false));
      return dispatch(setUserData(false));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useRedirect(firestore, functions, handleOpenSnackBar);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
      <SnackBar
        open={open}
        severity={severity}
        message={message}
        title={title}
        handleClose={handleClose}
      />
    </AuthContext.Provider>
  );
};

const GlobalProvider = (props) => {
  const { children } = props;
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

export { AuthContext };
export default GlobalProvider;
