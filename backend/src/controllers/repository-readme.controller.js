const {
  getRepositoryReadme,
} = require("../services/repository-readme-query.service");

async function getRepositoryReadmeController(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const readme = await getRepositoryReadme(repositoryId, req.user.id);

    return res.status(200).json({
      success: true,
      readme,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRepositoryReadmeController,
};
