import { configureStore } from '@reduxjs/toolkit';
import outputsReducer, {
  fetchOutputs,
  addOutput,
  updateOutput,
  deleteOutput,
} from './outputsSlice';
import { firestore } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Mock Firebase Firestore functions
jest.mock('firebase/firestore');

describe('outputs slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        outputs: outputsReducer,
      },
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().outputs).toEqual({
      outputs: [],
      selectedOutput: null,
      status: 'idle',
      error: null,
    });
  });

  it('should fetch outputs from Firestore', async () => {
    const mockOutputs = [{ id: '1', name: 'Output 1' }, { id: '2', name: 'Output 2' }];
    getDocs.mockResolvedValue({
      docs: mockOutputs.map((output) => ({ id: output.id, data: () => output })),
    });

    await store.dispatch(fetchOutputs());

    const state = store.getState().outputs;
    expect(state.outputs).toEqual(mockOutputs);
    expect(state.status).toEqual('succeeded');
  });

  it('should add an output to Firestore', async () => {
    const newOutput = { name: 'New Output', value: 'Some value' };
    addDoc.mockResolvedValue({ id: '3' });

    await store.dispatch(addOutput(newOutput));

    const state = store.getState().outputs;
    expect(state.outputs).toContainEqual({ id: '3', ...newOutput });
  });

  it('should update an output in Firestore', async () => {
    const updates = { name: 'Updated Output' };
    updateDoc.mockResolvedValue();

    await store.dispatch(updateOutput({ id: '1', updates }));

    const state = store.getState().outputs;
    expect(state.outputs.find((output) => output.id === '1').name).toEqual('Updated Output');
  });

  it('should delete an output from Firestore', async () => {
    deleteDoc.mockResolvedValue();

    await store.dispatch(deleteOutput('1'));

    const state = store.getState().outputs;
    expect(state.outputs.find((output) => output.id === '1')).toBeUndefined();
  });
});
