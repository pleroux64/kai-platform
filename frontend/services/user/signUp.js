import { createUserWithEmailAndPassword } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'

import { AUTH_ERROR_MESSAGES } from '@/constants/auth'

import { sendVerification } from './manageUser'

import { auth, functions } from '@/redux/store'

const signUp = async (email, password, fullName) => {
  try {
    const createUser = httpsCallable(functions, 'signUpUser')

    const response = await createUserWithEmailAndPassword(auth, email, password)

    await createUser({ email, fullName, uid: response.user.uid })
    await sendVerification(response.user)

    return response.user
  } catch (error) {
    throw new Error(AUTH_ERROR_MESSAGES[error?.code])
  }
}

export { signUp }
