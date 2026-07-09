const {
  getRepositorySummary,
} = require("../services/repository-summary.service");

async function getRepositorySummaryController(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const result = await getRepositorySummary(repositoryId, req.user.id);

    return res.status(200).json({
      success: true,
      summary: result.summary,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRepositorySummaryController,
};
