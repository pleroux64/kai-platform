import { configureStore } from '@reduxjs/toolkit';

import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import toolsReducer from './slices/toolsSlice';
import userReducer from './slices/userSlice';

import firebaseConfig from '@/firebase/config';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

// Connect to Firebase Emulators if running locally
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tools: toolsReducer,
    chat: chatReducer,
  },
});

export { auth, firestore, functions };
export default store;
// src/features/outputs/outputsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';

// Fetch outputs from Firestore
export const fetchOutputs = createAsyncThunk('outputs/fetchOutputs', async () => {
  const snapshot = await getDocs(collection(firestore, 'outputs'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Add a new output to Firestore
export const addOutput = createAsyncThunk('outputs/addOutput', async (output) => {
  const docRef = await addDoc(collection(firestore, 'outputs'), output);
  return { id: docRef.id, ...output };
});

// Update an existing output in Firestore
export const updateOutput = createAsyncThunk('outputs/updateOutput', async ({ id, updates }) => {
  const docRef = doc(firestore, 'outputs', id);
  await updateDoc(docRef, updates);
  return { id, updates };
});

// Delete an output from Firestore
export const deleteOutput = createAsyncThunk('outputs/deleteOutput', async (id) => {
  const docRef = doc(firestore, 'outputs', id);
  await deleteDoc(docRef);
  return id;
});

const outputsSlice = createSlice({
  name: 'outputs',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutputs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOutputs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOutputs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addOutput.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOutput.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const existingOutput = state.items.find((output) => output.id === id);
        if (existingOutput) {
          Object.assign(existingOutput, updates);
        }
      })
      .addCase(deleteOutput.fulfilled, (state, action) => {
        state.items = state.items.filter((output) => output.id !== action.payload);
      });
  },
});

export default outputsSlice.reducer;
