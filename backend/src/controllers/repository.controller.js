const { importRepository } = require("../services/repository-import.service");

const {
  getDashboardRepositories,
} = require("../services/repository-dashboard.service");

const { openRepository } = require("../services/repository-open.service");

async function importRepositoryController(req, res, next) {
  try {
    const { githubUrl } = req.body;

    const repository = await importRepository(githubUrl, req.user.id);

    return res.status(201).json({
      success: true,
      repository: {
        id: repository.id,
        name: repository.name,
        githubUrl: repository.github_url,
        status: repository.status,
      },
    });
  } catch (error) {
    console.error("Import Controller Error:");
    console.error(error);
    next(error);
  }
}

async function getDashboardRepositoriesController(req, res, next) {
  try {
    const repositories = await getDashboardRepositories(req.user.id);

    return res.status(200).json({
      success: true,
      repositories: repositories.map((repository) => ({
        id: repository.id,
        name: repository.name,
        githubUrl: repository.github_url,
        status: repository.status,
        defaultBranch: repository.default_branch,
        indexedAt: repository.indexed_at,
        lastCheckedAt: repository.last_checked_at,
        importedAt: repository.imported_at,
      })),
    });
  } catch (error) {
    next(error);
  }
}

async function openRepositoryController(req, res, next) {
  try {
    const { repositoryId } = req.params;

    const repository = await openRepository(repositoryId, req.user.id);

    return res.status(200).json({
      success: true,
      repository: {
        id: repository.id,
        name: repository.name,
        githubUrl: repository.github_url,
        status: repository.status,
        aiIndexStatus: repository.ai_index_status,
        defaultBranch: repository.default_branch,
        technologies: repository.technologies,
        latestCommitSha: repository.latest_commit_sha,
        indexedAt: repository.indexed_at,
        lastCheckedAt: repository.last_checked_at,
        createdAt: repository.created_at,
        updatedAt: repository.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  importRepositoryController,
  getDashboardRepositoriesController,
  openRepositoryController,
};
