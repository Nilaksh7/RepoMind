const { parseGitHubRepositoryUrl } = require("../utils/github-url");

async function getLatestRepositoryVersion(githubUrl) {
  const { owner, repositoryName } = parseGitHubRepositoryUrl(githubUrl);

  const repositoryResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repositoryName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!repositoryResponse.ok) {
    const body = await repositoryResponse.text();

    throw new Error(
      `GitHub Repository API Error (${repositoryResponse.status}): ${body}`,
    );
  }

  const repositoryData = await repositoryResponse.json();

  const defaultBranch = repositoryData.default_branch;

  const commitResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repositoryName}/commits/${defaultBranch}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!commitResponse.ok) {
    const body = await commitResponse.text();

    throw new Error(
      `GitHub Commit API Error (${commitResponse.status}): ${body}`,
    );
  }

  const commitData = await commitResponse.json();

  return {
    sha: commitData.sha,
    defaultBranch,
  };
}

module.exports = {
  getLatestRepositoryVersion,
};
