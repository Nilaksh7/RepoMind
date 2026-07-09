const {
  findRepositoryByIdForUser,
} = require("../database/user-repository.repository");

const {
  getRepositoryStatistics,
  getLanguageStatistics,
  getLargestFiles,
} = require("../database/repository-statistics.repository");

function isValidUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

async function getRepositoryStatisticsSummary(repositoryId, userId) {
  if (
    typeof repositoryId !== "string" ||
    repositoryId.trim() === "" ||
    !isValidUuid(repositoryId)
  ) {
    const error = new Error("Invalid repository ID");
    error.statusCode = 400;
    throw error;
  }

  const repository = await findRepositoryByIdForUser(userId, repositoryId);

  if (!repository) {
    const error = new Error("Repository not found");
    error.statusCode = 404;
    throw error;
  }

  const [statistics, languages, largestFiles] = await Promise.all([
    getRepositoryStatistics(repositoryId),
    getLanguageStatistics(repositoryId),
    getLargestFiles(repositoryId),
  ]);

  return {
    repository: {
      id: repository.id,
      name: repository.name,
      githubUrl: repository.github_url,
      status: repository.status,
    },

    statistics: {
      totalFiles: Number(statistics.totalFiles),
      totalDirectories: Number(statistics.totalDirectories),
      totalSizeBytes: Number(statistics.totalSizeBytes),
    },

    languages: languages.map((language) => ({
      extension: language.extension,
      count: Number(language.count),
    })),

    largestFiles,
  };
}

module.exports = {
  getRepositoryStatisticsSummary,
};
