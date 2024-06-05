require('dotenv').config({ path: '../.env' }); // Ensure this is at the top
const admin = require('firebase-admin');

admin.initializeApp();

const userController = require('./controllers/userController');
const kaiAIController = require('./controllers/kaiAIController');
const outputController = require('./controllers/outputController');
const { seedDatabase } = require('./cloud_db_seed');

seedDatabase();

/* Migration Scripts */
// const {
// } = require("./migrationScripts/modifyChallengePlayersData");
const migrationScripts = {};

module.exports = {
  /* Authenticaition */
  signUpUser: userController.signUpUser,

  // get historys
  history: userController.getHist,
  setOutput: userController.setHist,
  delOutput: userController.delHist,

  /* Kai AI */
  chat: kaiAIController.chat,
  tool: kaiAIController.tool,
  createChatSession: kaiAIController.createChatSession,

  /* Output CRUD Operations */
  createOutput: outputController.createOutput,
  updateOutput: outputController.updateOutput,
  deleteOutput: outputController.deleteOutput,
  getOutputs: outputController.getOutputs,

  /* Migration Scripts - For running  */
  ...migrationScripts,
};
