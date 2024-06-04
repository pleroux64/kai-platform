const admin = require('firebase-admin');
const { https } = require('firebase-functions');
const { HttpsError } = require('firebase-functions/v1/auth');

/**
 * Creates a new user document in the Firestore collection "users" with the provided data.
 *
 * @param {Object} data - The data object containing the user's email, full name, and unique identifier (uid).
 * @param {Object} context - The context object containing information about the authenticated user.
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} An object with a status and message property indicating the success of the operation.
 */
exports.signUpUser = https.onCall(async (data, context) => {
  const { email, fullName, uid } = data;

  if (!email || !fullName || !uid) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }

  const userRef = admin.firestore().collection('users').doc(uid);
  const userDoc = {
    id: uid,
    email,
    fullName,
  };
  await userRef.set(userDoc);
  return { status: 'success', message: 'User document created successfully' };
});

// #region get History GET and POST
/**
 * get user's chat history from DB use POST request
 *
 * @param {Object} data - The data object containing the user's unique identifier (uid), session identidier (sid).
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} status and the user's history in a list form
 */
const gethistPOST = https.onCall(async (data) => {
  const { uid, sid } = data;
  if (!uid || !sid) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  const hists = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('Sessions')
    .doc(sid)
    .collection('Hists')
    .get();
  return { status: 'success', data: hists.docs.map((doc) => doc.data()) };
});

/**
 * get user's chat history from DB use GET request
 *
 * @param {Object} req - The data object containing the user's unique identifier (uid), session identidier (sid).
 * @param {Object} res - Return status and the user's history in a list form.
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 */
const gethistGET = https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const { uid, sid } = req.body.data;
    if (!uid || !sid) {
      throw new https.HttpsError(
        'failed-precondition',
        'Please provide all required fields'
      );
    }
    const hists = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('Sessions')
      .doc(sid)
      .collection('Hists')
      .get();
    res
      .status(200)
      .send({ status: 'success', data: hists.docs.map((doc) => doc.data()) });
  } else {
    // Handle other types of requests
    res.status(405).send('Method Not Allowed');
  }
});

exports.getHist = gethistGET; // or histPOST if want use post to access
// #endregion

/**
 * Creates a new user chat History document.
 *
 * @param {Object} data - The data object containing the user's unique identifier (uid), session identidier (sid), and list of messages (messages).
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} - Return status 200/other.
 */
// if you are here, hey, this is a easter egg. Me BB will stay with CC
exports.setHist = https.onCall(async (data) => {
  const { uid, sid, messages } = data;
  if (!uid || !messages) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  const histsRef = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('Sessions')
    .doc(sid)
    .collection('Hists');
  if (!histsRef.get().exists) {
    // complete set new history when message structure known
  } else {
    throw new HttpsError(
      'already-exists',
      'such Session already have a History'
    );
  }
  return { status: 'success' };
});

const admin = require('firebase-admin');
const { https } = require('firebase-functions');
const { HttpsError } = require('firebase-functions/v1/auth');

// Initialize Firebase Admin SDK
admin.initializeApp();

// #region createDocument
/**
 * Creates a new document in the specified Firestore collection.
 *
 * @param {Object} data - The data object containing the collection name and document data.
 * @param {Object} context - The context object containing information about the authenticated user.
 * @throws {HttpsError} If the required fields are missing or invalid.
 * @return {Object} An object with a status and message indicating the success of the operation.
 */
exports.createDocument = https.onCall(async (data, context) => {
  const { collectionName, documentData } = data;

  if (!collectionName || !documentData) {
    throw new HttpsError('failed-precondition', 'Please provide all required fields');
  }

  try {
    const docRef = await admin.firestore().collection(collectionName).add(documentData);
    return { status: 'success', message: 'Document created successfully', id: docRef.id };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to create document', error);
  }
});
// #endregion

// #region readDocument
/**
 * Retrieves a document from the specified Firestore collection by document ID.
 *
 * @param {Object} data - The data object containing the collection name and document ID.
 * @param {Object} context - The context object containing information about the authenticated user.
 * @throws {HttpsError} If the required fields are missing or the document does not exist.
 * @return {Object} An object with a status and the document data.
 */
exports.readDocument = https.onCall(async (data, context) => {
  const { collectionName, documentId } = data;

  if (!collectionName || !documentId) {
    throw new HttpsError('failed-precondition', 'Please provide all required fields');
  }

  try {
    const docRef = admin.firestore().collection(collectionName).doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new HttpsError('not-found', 'Document not found');
    }

    return { status: 'success', data: docSnapshot.data() };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to read document', error);
  }
});
// #endregion

// #region updateDocument
/**
 * Updates an existing document in the specified Firestore collection by document ID.
 *
 * @param {Object} data - The data object containing the collection name, document ID, and update data.
 * @param {Object} context - The context object containing information about the authenticated user.
 * @throws {HttpsError} If the required fields are missing or the document does not exist.
 * @return {Object} An object with a status and message indicating the success of the operation.
 */
exports.updateDocument = https.onCall(async (data, context) => {
  const { collectionName, documentId, updateData } = data;

  if (!collectionName || !documentId || !updateData) {
    throw new HttpsError('failed-precondition', 'Please provide all required fields');
  }

  try {
    const docRef = admin.firestore().collection(collectionName).doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new HttpsError('not-found', 'Document not found');
    }

    await docRef.update(updateData);
    return { status: 'success', message: 'Document updated successfully' };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to update document', error);
  }
});
// #endregion

// #region deleteDocument
/**
 * Deletes a document from the specified Firestore collection by document ID.
 *
 * @param {Object} data - The data object containing the collection name and document ID.
 * @param {Object} context - The context object containing information about the authenticated user.
 * @throws {HttpsError} If the required fields are missing or the document does not exist.
 * @return {Object} An object with a status and message indicating the success of the operation.
 */
exports.deleteDocument = https.onCall(async (data, context) => {
  const { collectionName, documentId } = data;

  if (!collectionName || !documentId) {
    throw new HttpsError('failed-precondition', 'Please provide all required fields');
  }

  try {
    const docRef = admin.firestore().collection(collectionName).doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new HttpsError('not-found', 'Document not found');
    }

    await docRef.delete();
    return { status: 'success', message: 'Document deleted successfully' };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to delete document', error);
  }
});
// #endregion
