const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { HttpsError } = require('firebase-functions/v1/auth');

// Create Output Function
exports.createOutput = functions.https.onCall(async (data, context) => {
  const { title, type, creationDate, content } = data;

  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!title || !type || !creationDate || !content) {
    throw new HttpsError(
      'invalid-argument',
      'Please provide all required fields'
    );
  }

  try {
    const outputData = {
      title,
      type,
      creationDate: admin.firestore.Timestamp.fromDate(new Date(creationDate)),
      content,
      userId: context.auth.uid,
    };
    const docRef = await admin
      .firestore()
      .collection('outputs')
      .add(outputData);
    return { id: docRef.id, ...outputData };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to create output', error);
  }
});

// Update Output Function
exports.updateOutput = functions.https.onCall(async (data, context) => {
  const { id, title, type, content } = data;

  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!id || !title || !type || !content) {
    throw new HttpsError(
      'invalid-argument',
      'Please provide all required fields'
    );
  }

  try {
    const docRef = admin.firestore().collection('outputs').doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new HttpsError('not-found', 'Output not found');
    }

    if (docSnapshot.data().userId !== context.auth.uid) {
      throw new HttpsError(
        'permission-denied',
        'You do not have permission to update this output'
      );
    }

    await docRef.update({
      title,
      type,
      content,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      id,
      title,
      type,
      content,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to update output', error);
  }
});

// Delete Output Function
exports.deleteOutput = functions.https.onCall(async (data, context) => {
  const { id } = data;

  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!id) {
    throw new HttpsError('invalid-argument', 'Please provide the output ID');
  }

  try {
    const docRef = admin.firestore().collection('outputs').doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new HttpsError('not-found', 'Output not found');
    }

    if (docSnapshot.data().userId !== context.auth.uid) {
      throw new HttpsError(
        'permission-denied',
        'You do not have permission to delete this output'
      );
    }

    await docRef.delete();

    return { id, message: 'Output deleted successfully' };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to delete output', error);
  }
});

// Retrieve Outputs Function
exports.getOutputs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection('outputs')
      .where('userId', '==', context.auth.uid)
      .orderBy('creationDate', 'desc')
      .get();

    const outputs = [];
    snapshot.forEach((doc) => {
      outputs.push({ id: doc.id, ...doc.data() });
    });

    return outputs;
  } catch (error) {
    throw new HttpsError('internal', 'Failed to retrieve outputs', error);
  }
});
