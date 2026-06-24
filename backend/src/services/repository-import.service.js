const { parseGitHubRepositoryUrl } = require("../utils/github-url");
const {
  findRepositoryByGitHubUrl,
  createRepository,
  updateRepositoryStatus,
  deleteRepositoryById,
} = require("../database/repository.repository");
const { cloneRepository, removeTemporaryRepository } = require("./git.service");

async function importRepository(githubUrl) {
  let repositoryId = null;
  let clonePath = null;

  try {
    // Parse and normalize GitHub URL
    const { normalizedUrl, repositoryName } =
      parseGitHubRepositoryUrl(githubUrl);

    // Check for duplicate
    const existing = await findRepositoryByGitHubUrl(normalizedUrl);
    if (existing) {
      const error = new Error("Repository has already been imported");
      error.statusCode = 409;
      throw error;
    }

    // Create repository row
    const createdRepository = await createRepository({
      githubUrl: normalizedUrl,
      name: repositoryName,
    });
    repositoryId = createdRepository.id;

    // Update status to cloning
    await updateRepositoryStatus(repositoryId, "cloning");

    // Clone repository
    clonePath = await cloneRepository({
      githubUrl: normalizedUrl,
      repositoryId,
    });

    // Remove temporary clone
    await removeTemporaryRepository(clonePath);
    clonePath = null;

    // Update status to imported
    const updatedRepository = await updateRepositoryStatus(
      repositoryId,
      "imported",
    );

    return updatedRepository;
  } catch (error) {
    if (clonePath) {
      try {
        await removeTemporaryRepository(clonePath);
      } catch (cleanupError) {
        console.error("Failed to clean up temporary repository:", cleanupError);
      }
    }

    if (repositoryId) {
      try {
        await updateRepositoryStatus(repositoryId, "failed");
      } catch (statusUpdateError) {
        console.error(
          "Failed to update repository status after import failure:",
          statusUpdateError,
        );
      }
    }

    throw error;
  }
}

module.exports = { importRepository };
