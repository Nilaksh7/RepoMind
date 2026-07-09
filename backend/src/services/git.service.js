const path = require("path");
const fs = require("fs/promises");
const simpleGit = require("simple-git");

const TEMP_REPOSITORIES_DIRECTORY = path.resolve(__dirname, "../../temp");

async function cloneRepository({ githubUrl, repositoryId }) {
  await fs.mkdir(TEMP_REPOSITORIES_DIRECTORY, { recursive: true });

  const destinationPath = path.join(TEMP_REPOSITORIES_DIRECTORY, repositoryId);

  const git = simpleGit();
  await git.clone(githubUrl, destinationPath, ["--depth=1", "--single-branch"]);

  return destinationPath;
}

async function removeTemporaryRepository(repositoryPath) {
  if (!repositoryPath) {
    return;
  }

  await fs.rm(repositoryPath, { recursive: true, force: true });
}

module.exports = {
  cloneRepository,
  removeTemporaryRepository,
};
