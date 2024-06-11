import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

import firebaseConfig from './config'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Only connect to the emulator if running in the browser and on localhost
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export { db }
