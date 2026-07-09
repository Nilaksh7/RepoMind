const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const {
  getRepositoryReadmeFile,
} = require("../database/repository-readme.repository");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getRepositoryReadme(repositoryId, userId) {
  if (
    typeof repositoryId !== "string" ||
    repositoryId.trim() === "" ||
    !UUID_REGEX.test(repositoryId)
  ) {
    const error = new Error("Invalid repository ID");
    error.statusCode = 400;
    throw error;
  }

  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  const readme = await getRepositoryReadmeFile(repositoryId);

  return readme;
}

module.exports = {
  getRepositoryReadme,
};
