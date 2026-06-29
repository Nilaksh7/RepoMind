const pool = require("../config/db");
const { parseGitHubRepositoryUrl } = require("../utils/github-url");
const {
  findRepositoryByGitHubUrl,
  createRepository,
  updateRepositoryStatus,
} = require("../database/repository.repository");
const {
  saveRepositoryFiles,
} = require("../database/repository-files.repository");
const { buildRepositoryFileTree } = require("./repository-tree.service");
const { cloneRepository, removeTemporaryRepository } = require("./git.service");

async function importRepository(githubUrl) {
  let clonePath = null;
  let client = null;

  try {
    // Step 1: Validate and normalize the GitHub URL
    const { normalizedUrl, repositoryName } =
      parseGitHubRepositoryUrl(githubUrl);

    // Step 2: Reject duplicate imports
    const existingRepository = await findRepositoryByGitHubUrl(normalizedUrl);

    if (existingRepository) {
      const error = new Error("Repository has already been imported");
      error.statusCode = 409;
      throw error;
    }

    // Step 3: Clone repository to a temporary location
    const temporaryCloneId = `import-${Date.now()}`;

    clonePath = await cloneRepository({
      githubUrl: normalizedUrl,
      repositoryId: temporaryCloneId,
    });

    // Step 4: Traverse the repository and build the flat tree
    const repositoryEntries = await buildRepositoryFileTree(clonePath);

    // Step 5: Start database transaction
    client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create repository record
      const repository = await createRepository(
        {
          githubUrl: normalizedUrl,
          name: repositoryName,
        },
        client,
      );

      // Store repository tree
      await saveRepositoryFiles(repository.id, repositoryEntries, client);

      // Mark import as completed
      const updatedRepository = await updateRepositoryStatus(
        repository.id,
        "imported",
        client,
      );

      await client.query("COMMIT");

      return updatedRepository;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } finally {
    if (clonePath) {
      try {
        await removeTemporaryRepository(clonePath);
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }
  }
}

module.exports = {
  importRepository,
};
