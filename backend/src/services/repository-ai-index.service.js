const axios = require("axios");

async function indexRepositoryEmbeddings(repositoryId) {
  const url = `${process.env.AI_SERVICE_URL}/repositories/${repositoryId}/index`;

  console.log("Calling:", url);

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "x-api-key": process.env.AI_SERVICE_API_KEY,
        },
      },
    );

    console.log("AI Success:", response.status);

    return response.data;
  } catch (err) {
    console.log("========== AI ERROR ==========");
    console.log("Status:", err.response?.status);
    console.log("Body:", err.response?.data);
    console.log("Message:", err.message);
    console.log("=============================");

    throw err;
  }
}

module.exports = {
  indexRepositoryEmbeddings,
};
