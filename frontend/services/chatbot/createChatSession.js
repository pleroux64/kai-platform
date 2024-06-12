import { httpsCallable } from 'firebase/functions';

import { setError, setStreaming, setTyping } from '@/redux/slices/chatSlice';
import { functions } from '@/redux/store';

/**
 * Creates a chat session.
 *
 * @param {Object} payload - The payload for creating the chat session.
 * @param {function} dispatch - The dispatch function for managing state.
 * @return {Object} - An object containing a status and data containing the session.
 */
const createChatSession = async (payload, dispatch) => {
  try {
    const createSession = httpsCallable(functions, 'createChatSession');
    const response = await createSession(payload);

    return response.data;
  } catch (err) {
    dispatch(setError('Error! Couldn\u0027t send message'));
    dispatch(setStreaming(false));
    dispatch(setTyping(false));
    setTimeout(() => {
      dispatch(setError(null));
    }, 3000);
    throw new Error('Error could not send message');
  }
};

/**
 * Reads a chat session.
 *
 * @param {Object} payload - The payload for reading the chat session.
 * @param {function} dispatch - The dispatch function for managing state.
 * @return {Object} - An object containing the chat session data.
 */
const readChatSession = async (payload, dispatch) => {
  try {
    const readSession = httpsCallable(functions, 'readChatSession');
    const response = await readSession(payload);

    return response.data;
  } catch (err) {
    dispatch(setError('Error! Couldn\u0027t read chat session'));
    dispatch(setStreaming(false));
    dispatch(setTyping(false));
    setTimeout(() => {
      dispatch(setError(null));
    }, 3000);
    throw new Error('Error could not read chat session');
  }
};

/**
 * Updates a chat session.
 *
 * @param {Object} payload - The payload for updating the chat session.
 * @param {function} dispatch - The dispatch function for managing state.
 * @return {Object} - An object containing the updated chat session data.
 */
const updateChatSession = async (payload, dispatch) => {
  try {
    const updateSession = httpsCallable(functions, 'updateChatSession');
    const response = await updateSession(payload);

    return response.data;
  } catch (err) {
    dispatch(setError('Error! Couldn\u0027t update chat session'));
    dispatch(setStreaming(false));
    dispatch(setTyping(false));
    setTimeout(() => {
      dispatch(setError(null));
    }, 3000);
    throw new Error('Error could not update chat session');
  }
};

/**
 * Deletes a chat session.
 *
 * @param {Object} payload - The payload for deleting the chat session.
 * @param {function} dispatch - The dispatch function for managing state.
 * @return {Object} - An object containing the status of the deletion.
 */
const deleteChatSession = async (payload, dispatch) => {
  try {
    const deleteSession = httpsCallable(functions, 'deleteChatSession');
    const response = await deleteSession(payload);

    return response.data;
  } catch (err) {
    dispatch(setError('Error! Couldn\u0027t delete chat session'));
    dispatch(setStreaming(false));
    dispatch(setTyping(false));
    setTimeout(() => {
      dispatch(setError(null));
    }, 3000);
    throw new Error('Error could not delete chat session');
  }
};

export default deleteChatSession;
