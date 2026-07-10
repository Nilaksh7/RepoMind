const axios = require("axios");

async function indexRepositoryEmbeddings(repositoryId) {
  try {
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
  } catch (error) {
    console.log("===== AI REQUEST FAILED =====");

    console.log(
      "URL:",
      `${process.env.AI_SERVICE_URL}/repositories/${repositoryId}/index`,
    );

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Body:", error.response.data);
    } else {
      console.log("Message:", error.message);
    }

    throw error;
  }
}

module.exports = {
  indexRepositoryEmbeddings,
};
