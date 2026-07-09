const {
  askRepositoryQuestion,
  callRepositoryAI,
} = require("../services/repository-ai.service");

async function askQuestion(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const data = await askRepositoryQuestion(
      repositoryId,
      question,
      req.user.id,
    );

    return res.json({
      success: true,
      answer: data.answer,
    });
  } catch (error) {
    next(error);
  }
}

async function getDependencyGraph(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const data = await callRepositoryAI(
      repositoryId,
      req.user.id,
      "dependency-graph",
      {},
      "get",
    );

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  askQuestion,
  getDependencyGraph,
};
