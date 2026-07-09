const axios = require("axios");

const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

async function callRepositoryAI(
  repositoryId,
  userId,
  endpoint,
  body = {},
  method = "post",
  params = {},
) {
  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  const baseUrl = process.env.AI_SERVICE_URL;

  try {
    const response = await axios({
      method,
      url: `${baseUrl}/repositories/${repositoryId}/${endpoint}`,
      data: body,
      params,
      headers: {
        "x-api-key": process.env.AI_SERVICE_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.data) {
      const message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.detail ||
            error.response.data.message ||
            "AI service request failed";

      const aiError = new Error(message);
      aiError.statusCode = error.response.status;
      throw aiError;
    }

    const aiError = new Error("AI service unavailable");
    aiError.statusCode = 503;
    throw aiError;
  }
}

async function askRepositoryQuestion(repositoryId, question, userId) {
  return callRepositoryAI(repositoryId, userId, "ask", { question });
}

async function searchRepository(repositoryId, query, userId, limit = 10) {
  return callRepositoryAI(repositoryId, userId, "search", {}, "get", {
    query,
    limit,
  });
}

module.exports = {
  callRepositoryAI,
  askRepositoryQuestion,
  searchRepository,
};
