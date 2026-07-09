const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const {
  getRepositoryFiles,
} = require("../database/repository-files.repository");

const { buildNestedRepositoryTree } = require("../utils/build-tree");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getRepositoryTree(repositoryId, userId) {
  if (typeof repositoryId !== "string" || repositoryId.trim() === "") {
    const error = new Error("Repository ID is required");
    error.statusCode = 400;
    throw error;
  }

  repositoryId = repositoryId.trim();

  if (!UUID_REGEX.test(repositoryId)) {
    const error = new Error("Invalid repository ID");
    error.statusCode = 400;
    throw error;
  }

  // Verify that the repository belongs to the authenticated user
  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  const files = await getRepositoryFiles(repositoryId);
  const tree = buildNestedRepositoryTree(files);

  return {
    repository: {
      id: repository.id,
      name: repository.name,
      githubUrl: repository.github_url,
      status: repository.status,
    },
    tree,
  };
}

module.exports = {
  getRepositoryTree,
};
