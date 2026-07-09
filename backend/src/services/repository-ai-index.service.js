const axios = require("axios");

async function indexRepositoryEmbeddings(repositoryId) {
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/repositories/${repositoryId}/index`,
    {},
    {
      headers: {
        "x-api-key": process.env.AI_SERVICE_API_KEY,
      },
    },
  );

  return response.data;
}

module.exports = {
  indexRepositoryEmbeddings,
};
