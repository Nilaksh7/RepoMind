const {
  getRepositoryFileContent,
} = require("../services/repository-file-content-query.service");

async function getRepositoryFileContentController(req, res, next) {
  try {
    const { repositoryId, fileId } = req.params;
    const result = await getRepositoryFileContent(repositoryId, fileId);

    res.status(200).json({
      success: true,
      file: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRepositoryFileContentController,
};
