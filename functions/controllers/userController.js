const admin = require('firebase-admin');
const { https } = require('firebase-functions');
const { HttpsError } = require('firebase-functions/v1/auth');
const { stringToHash } = require('../utils/hashUtil');
const sortUtil = require('../utils/sortUtil');

// #region signUp a user
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
  const defaultHist = {
    id: '-1',
    content: '',
    creationDate: 0,
    title: '',
    type: '',
  };
  await userRef.collection('outputs').doc('-1').set(defaultHist);
  return { status: 'success', message: 'User document created successfully' };
});
// #endregion

// #region get History GET and POST
/**
 * get user's chat history from DB use POST request
 *
 * @param {Object} data - The data object containing the user's unique identifier (uid), session identidier (sid).
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} status and the user's history in a list form
 */
const gethistPOST = https.onCall(async (data) => {
  const { uid } = data;
  if (!uid) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  const hists = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('outputs')
    .get();
  return { status: 'success', data: hists.docs.map((doc) => doc.data()) };
});

// #region GET request archive
/**
 * get user's chat history from DB use GET request
 *
 * @param {Object} req - The data object containing the user's unique identifier (uid), session identidier (sid).
 * @param {Object} res - Return status and the user's history in a list form.
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 */
const gethistGET = https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const { uid } = req.body.data;
    if (!uid) {
      throw new https.HttpsError(
        'failed-precondition',
        'Please provide all required fields'
      );
    }
    const hists = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('outputs')
      .get();
    res
      .status(200)
      .send({ status: 'success', data: hists.docs.map((doc) => doc.data()) });
  } else {
    // Handle other types of requests
    res.status(405).send('Method Not Allowed');
  }
});
// #endregion

exports.getHist = gethistGET;
// #endregion

// #region setHist
/**
 * Creates a new user chat History document.
 *
 * @param {Object} data - The data object containing the user's unique identifier (uid).
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} - Return status 200/other.
 */
// if you are here, hey, this is a easter egg. Me BB will stay with CC
exports.setHist = https.onCall(async (data) => {
  const { uid, title, type, content } = data;
  const creationDate = Date.now();
  if (!uid || !title || !type || !content) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  const id = stringToHash(title + creationDate.toString() + type).toString();
  const histsRef = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('outputs')
    .doc(id);
  if (!(await histsRef.get()).exists) {
    const outputDoc = {
      id,
      title,
      type,
      creationDate,
      content,
    };
    histsRef.set(outputDoc);
  } else {
    throw new HttpsError(
      'already-exists',
      'such Session already have a History'
    );
  }
  return { status: 'success' };
});
// #endregion

// #region delet a output histoy with uis and oid
/**
 * delete history output
 *
 * @param {Object} data - The data object containing the user's unique identifier (uid), and output history id(oid).
 * @throws {HttpsError} If any of the required fields (email, fullName, uid) are missing in the data object.
 * @return {Object} - Return status 200/other.
 */
exports.delHist = https.onCall(async (data) => {
  const { uid, oid } = data;
  if (!uid || !oid) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  const histsRef = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('outputs')
    .doc(oid);
  if ((await histsRef.get()).exists) {
    histsRef.delete();
  } else {
    throw new HttpsError('not-found', 'trying to delete history not exist');
  }
  return { status: 'success' };
});
// #endregion

// #region sort by creationDate, type, or title.
exports.sortHist = https.onCall(async (data) => {
  const { uid, sortKey } = data;
  if (!uid || !sortKey) {
    throw new https.HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }
  // if (['creationDate', 'type', 'title'].includes(sortKey)) {
  //   throw new https.HttpsError('failed-precondition', 'type not allowed');
  // }
  let hists = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('outputs')
    .get();
  hists = hists.docs.map((doc) => doc.data());
  switch (sortKey) {
    case 'creationDate':
      hists.sort(sortUtil.crtDate);
      break;
    case 'type':
      hists.sort(sortUtil.type);
      break;
    case 'title':
      hists.sort(sortUtil.title);
      break;
    default:
      break;
  }
  return { status: 'success', data: hists };
});
// #endregion

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
    throw new HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }

  try {
    const docRef = await admin
      .firestore()
      .collection(collectionName)
      .add(documentData);
    return {
      status: 'success',
      message: 'Document created successfully',
      id: docRef.id,
    };
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
    throw new HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
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

// #region getDocumentTitle
/**
 * Retrieves a document from the specified Firestore collection by document ID.
 *
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} documentId - The ID of the document.
 * @throws {HttpsError} If the required fields are missing or the document does not exist.
 * @return {Object} An object with a status and the document's title data.
 */
async function getDocumentTitle(collectionName, documentId) {
  if (!collectionName || !documentId) {
    throw new HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
  }

  const docRef = admin.firestore().collection(collectionName).doc(documentId);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    throw new HttpsError('not-found', 'Document not found');
  }

  const docTitle = docSnapshot.data();
  if (!docTitle.title) {
    throw new HttpsError('not-found', 'Title field not found in the document');
  }

  return { title: docTitle.title };
}

exports.getDocumentTitle = https.onCall(async (data) => {
  try {
    const { collectionName, documentId } = data;
    const titleData = await getDocumentTitle(collectionName, documentId);
    return { status: 'success', data: titleData };
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
    throw new HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
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
    throw new HttpsError(
      'failed-precondition',
      'Please provide all required fields'
    );
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
