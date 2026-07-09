const { callRepositoryAI } = require("./repository-ai.service");

async function getRepositorySummary(repositoryId, userId) {
  return callRepositoryAI(repositoryId, userId, "summary");
}

module.exports = {
  getRepositorySummary,
};
