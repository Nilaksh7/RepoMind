const { searchRepository } = require("../services/repository-ai.service");

async function semanticSearch(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const { query, limit } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const results = await searchRepository(
      repositoryId,
      query,
      req.user.id,
      Number(limit) || 10,
    );

    return res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  semanticSearch,
};
