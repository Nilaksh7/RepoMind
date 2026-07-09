const pool = require("../config/db");

const { cloneRepository, removeTemporaryRepository } = require("./git.service");

const { indexRepository } = require("./repository-indexing.service");

const {
  deleteRepositoryFiles,
} = require("../database/repository-files.repository");

const {
  updateRepositoryMetadata,
} = require("../database/repository.repository");

const { indexRepositoryEmbeddings } = require("./repository-ai-index.service");

async function refreshRepository({ repository, repositoryVersion }) {
  let client = null;
  let clonePath = null;

  try {
    // Step 1: Clone latest repository
    const temporaryCloneId = `refresh-${Date.now()}`;

    clonePath = await cloneRepository({
      githubUrl: repository.github_url,
      repositoryId: temporaryCloneId,
    });

    // Step 2: Start database transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Step 3: Delete previous indexed data
    await deleteRepositoryFiles(repository.id, client);

    // Step 4: Re-index repository
    await indexRepository(repository.id, clonePath, client);

    // Step 5: Update repository metadata
    const updatedRepository = await updateRepositoryMetadata(
      repository.id,
      {
        status: "imported",
        defaultBranch: repositoryVersion.defaultBranch,
        latestCommitSha: repositoryVersion.sha,
      },
      client,
    );

    await client.query("COMMIT");

    // Generate AI embeddings after successful commit
    try {
      await indexRepositoryEmbeddings(updatedRepository.id);
    } catch (error) {
      console.error("Embedding generation failed:", error.message);
    }

    return updatedRepository;
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    if (client) {
      client.release();
    }

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
  refreshRepository,
};
