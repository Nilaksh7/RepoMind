const {
  getRepositoryTree,
} = require("../services/repository-tree-query.service");

async function getRepositoryTreeController(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const result = await getRepositoryTree(repositoryId, req.user.id);

    return res.status(200).json({
      success: true,
      repository: result.repository,
      tree: result.tree,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRepositoryTreeController,
};
