const {
  getRepositoriesForUser,
} = require("../database/user-repository.repository");

async function getDashboardRepositories(userId) {
  return await getRepositoriesForUser(userId);
}

module.exports = {
  getDashboardRepositories,
};
