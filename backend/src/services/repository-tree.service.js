const fs = require("fs/promises");
const path = require("path");

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
  "__pycache__",
  ".venv",
  "venv",
]);

const IGNORED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "uv.lock",
  "poetry.lock",
  "Pipfile.lock",
  "Cargo.lock",
  "composer.lock",
]);

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".ogg",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
]);

async function buildRepositoryFileTree(repositoryPath) {
  if (!repositoryPath) {
    throw new Error("Repository path is required");
  }

  const result = [];

  async function traverse(currentPath, parentRelativePath) {
    let entries;

    try {
      entries = await fs.readdir(currentPath, {
        withFileTypes: true,
      });
    } catch (error) {
      throw new Error(`Cannot read directory ${currentPath}: ${error.message}`);
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const entryRelativePath = parentRelativePath
        ? `${parentRelativePath}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        result.push({
          path: entryRelativePath,
          name: entry.name,
          type: "directory",
          extension: null,
          parentPath: parentRelativePath || null,
        });

        await traverse(path.join(currentPath, entry.name), entryRelativePath);

        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      // Skip environment files
      if (entry.name === ".env" || entry.name.startsWith(".env.")) {
        continue;
      }

      // Skip dependency lock files
      if (IGNORED_FILES.has(entry.name)) {
        continue;
      }

      // Skip binary assets
      const extension = path.extname(entry.name).toLowerCase();

      if (IGNORED_EXTENSIONS.has(extension)) {
        continue;
      }

      result.push({
        path: entryRelativePath,
        name: entry.name,
        type: "file",
        extension: extension || null,
        parentPath: parentRelativePath || null,
      });
    }
  }

  await traverse(repositoryPath, "");

  result.forEach((entry) => {
    entry.path = entry.path.split(path.sep).join("/");

    if (entry.parentPath) {
      entry.parentPath = entry.parentPath.split(path.sep).join("/");
    }
  });

  return result;
}

module.exports = {
  buildRepositoryFileTree,
};
