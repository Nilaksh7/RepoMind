const axios = require("axios");

const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const {
  getRepositoryFileContent,
} = require("../database/repository-file-contents.repository");

async function explainRepositoryFile(repositoryId, fileId, userId) {
  // Step 1: Verify repository access
  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  // Step 2: Load file
  const file = await getRepositoryFileContent(repositoryId, fileId);

  if (!file) {
    const error = new Error("Repository file not found");
    error.statusCode = 404;
    throw error;
  }

  // Step 3: Send to AI service
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/repositories/${repositoryId}/files/explain`,
    {
      path: file.path,
      extension: file.extension,
      content: file.content,
    },
    {
      headers: {
        "x-api-key": process.env.AI_SERVICE_API_KEY,
      },
    },
  );

  // Step 4: Return explanation
  return response.data.explanation;
}

module.exports = {
  explainRepositoryFile,
};
