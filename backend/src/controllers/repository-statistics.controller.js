const {
  getRepositoryStatisticsSummary,
} = require("../services/repository-statistics-query.service");

async function getRepositoryStatisticsController(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const result = await getRepositoryStatisticsSummary(repositoryId);

    return res.status(200).json({
      success: true,
      repository: result.repository,
      statistics: result.statistics,
      languages: result.languages,
      largestFiles: result.largestFiles,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRepositoryStatisticsController,
};
