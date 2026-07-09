const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const {
  getRepositoryFileContent: fetchRepositoryFileContent,
} = require("../database/repository-file-contents.repository");

function isValidUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

async function getRepositoryFileContent(repositoryId, fileId, userId) {
  if (
    typeof repositoryId !== "string" ||
    repositoryId.trim() === "" ||
    !isValidUuid(repositoryId)
  ) {
    const error = new Error("Invalid repository ID");
    error.statusCode = 400;
    throw error;
  }

  if (
    typeof fileId !== "string" ||
    fileId.trim() === "" ||
    !isValidUuid(fileId)
  ) {
    const error = new Error("Invalid file ID");
    error.statusCode = 400;
    throw error;
  }

  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  const file = await fetchRepositoryFileContent(repositoryId, fileId);

  if (!file) {
    const error = new Error("Repository file not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: file.id,
    path: file.path,
    extension: file.extension,
    sizeBytes: file.sizeBytes,
    content: file.content,
  };
}

module.exports = {
  getRepositoryFileContent,
};
