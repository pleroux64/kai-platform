import { configureStore } from '@reduxjs/toolkit';
import outputsReducer, { fetchOutputs, addOutput, updateOutput, deleteOutput } from './outputsSlice';
import { firestore } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe('outputs slice', () => {
  const initialState = {
    items: [],
    status: 'idle',
    error: null,
  };

  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        outputs: outputsReducer,
      },
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().outputs).toEqual(initialState);
  });

  it('should handle fetchOutputs', async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: '1', data: () => ({ name: 'test' }) }],
    });

    await store.dispatch(fetchOutputs());

    const state = store.getState().outputs;
    expect(state.status).toBe('succeeded');
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('test');
  });

  it('should handle addOutput', async () => {
    addDoc.mockResolvedValue({ id: '1' });

    const newOutput = { name: 'new output' };
    await store.dispatch(addOutput(newOutput));

    const state = store.getState().outputs;
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('new output');
  });

  it('should handle updateOutput', async () => {
    store = configureStore({
      reducer: {
        outputs: outputsReducer,
      },
      preloadedState: {
        outputs: {
          items: [{ id: '1', name: 'old name' }],
          status: 'idle',
          error: null,
        },
      },
    });

    updateDoc.mockResolvedValue();

    const updates = { name: 'updated name' };
    await store.dispatch(updateOutput({ id: '1', updates }));

    const state = store.getState().outputs;
    expect(state.items[0].name).toBe('updated name');
  });

  it('should handle deleteOutput', async () => {
    store = configureStore({
      reducer: {
        outputs: outputsReducer,
      },
      preloadedState: {
        outputs: {
          items: [{ id: '1', name: 'to be deleted' }],
          status: 'idle',
          error: null,
        },
      },
    });

    deleteDoc.mockResolvedValue();

    await store.dispatch(deleteOutput('1'));

    const state = store.getState().outputs;
    expect(state.items.length).toBe(0);
  });
});
