const pool = require("../config/db");
const { parseGitHubRepositoryUrl } = require("../utils/github-url");

const {
  findRepositoryByGitHubUrl,
  createRepository,
  updateRepositoryStatus,
} = require("../database/repository.repository");

const {
  createUserRepositoryMapping,
} = require("../database/user-repository.repository");

const { cloneRepository, removeTemporaryRepository } = require("./git.service");

const { getLatestRepositoryVersion } = require("./repository-version.service");

const { indexRepository } = require("./repository-indexing.service");

const { refreshRepository } = require("./repository-refresh.service");

const { indexRepositoryEmbeddings } = require("./repository-ai-index.service");

async function importRepository(githubUrl, userId) {
  let clonePath = null;
  let client = null;

  try {
    // Step 1: Validate GitHub URL
    const { normalizedUrl, repositoryName } =
      parseGitHubRepositoryUrl(githubUrl);

    // Step 2: Get latest version from GitHub
    const repositoryVersion = await getLatestRepositoryVersion(normalizedUrl);

    // Step 3: Check if repository already exists
    const existingRepository = await findRepositoryByGitHubUrl(normalizedUrl);

    // ==================================================
    // NEW REPOSITORY
    // ==================================================
    if (!existingRepository) {
      client = await pool.connect();

      try {
        await client.query("BEGIN");

        clonePath = await cloneRepository({
          githubUrl: normalizedUrl,
          repositoryId: `import-${Date.now()}`,
        });

        let repository = await createRepository(
          {
            githubUrl: normalizedUrl,
            name: repositoryName,
            defaultBranch: repositoryVersion.defaultBranch,
            latestCommitSha: repositoryVersion.sha,
          },
          client,
        );

        await indexRepository(repository.id, clonePath, client);

        repository = await updateRepositoryStatus(
          repository.id,
          "imported",
          client,
        );

        await createUserRepositoryMapping(userId, repository.id, client);

        await client.query("COMMIT");

        // Generate AI embeddings after successful commit
        console.log("Repository:", repository.id);

        try {
          await indexRepositoryEmbeddings(repository.id);
        } catch (error) {
          console.error("========== AI INDEXING FAILED ==========");

          if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
          } else {
            console.error("Message:", error.message);
          }

          console.error("========================================");
        }

        return repository;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    // ==================================================
    // EXISTING REPOSITORY
    // ==================================================

    let repository = existingRepository;

    if (existingRepository.latest_commit_sha !== repositoryVersion.sha) {
      repository = await refreshRepository({
        repository: existingRepository,
        repositoryVersion,
      });
    }

    await createUserRepositoryMapping(userId, repository.id);

    return repository;
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
