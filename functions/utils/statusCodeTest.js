const { https } = require('firebase-functions');
exports.statusCode = https.onRequest((req, res) => {
  res.status(req.body.code).send('error');
});
