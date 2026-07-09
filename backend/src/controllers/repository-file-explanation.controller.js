const {
  explainRepositoryFile,
} = require("../services/repository-file-explanation.service");

async function explainRepositoryFileController(req, res, next) {
  try {
    const { repositoryId, fileId } = req.params;

    const explanation = await explainRepositoryFile(
      repositoryId,
      fileId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  explainRepositoryFileController,
};
