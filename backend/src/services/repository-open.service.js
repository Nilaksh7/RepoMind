const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const { getLatestRepositoryVersion } = require("./repository-version.service");

const {
  updateRepositoryLastChecked,
} = require("../database/repository.repository");

const { shouldCheckRepositoryVersion } = require("../utils/repository-version");

const { refreshRepository } = require("./repository-refresh.service");

const {
  getRepositoryTechnologies,
} = require("../database/repository-tech-stack.repository");

async function openRepository(repositoryId, userId) {
  let repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  if (shouldCheckRepositoryVersion(repository.last_checked_at)) {
    const repositoryVersion = await getLatestRepositoryVersion(
      repository.github_url,
    );

    if (repository.latest_commit_sha === repositoryVersion.sha) {
      await updateRepositoryLastChecked(repository.id);

      repository.last_checked_at = new Date();
    } else {
      repository = await refreshRepository({
        repository,
        repositoryVersion,
      });
    }
  }

  repository.technologies = await getRepositoryTechnologies(repository.id);

  return repository;
}

module.exports = {
  openRepository,
};
