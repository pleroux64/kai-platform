import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';

// Refactor to accept firestore as an argument
export const fetchOutputHistory = createAsyncThunk(
  'outputHistory/fetchOutputHistory',
  async ({ firestore }, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'outputs'));
      const outputData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return outputData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
