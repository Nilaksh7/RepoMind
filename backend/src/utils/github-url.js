function createInvalidGitHubUrlError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function parseGitHubRepositoryUrl(githubUrl) {
  if (typeof githubUrl !== "string") {
    throw createInvalidGitHubUrlError("GitHub URL must be a string");
  }

  const trimmedUrl = githubUrl.trim();

  if (!trimmedUrl) {
    throw createInvalidGitHubUrlError("GitHub URL must not be empty");
  }

  const match = trimmedUrl.match(
    /^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/,
  );

  if (!match) {
    throw createInvalidGitHubUrlError("Invalid GitHub repository URL");
  }

  const owner = match[1];
  const repositoryName = match[2];

  return {
    normalizedUrl: `https://github.com/${owner}/${repositoryName}`,
    owner,
    repositoryName,
  };
}

module.exports = {
  parseGitHubRepositoryUrl,
};
