const fs = require("fs/promises");
const path = require("path");

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
]);

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".mp4",
  ".mov",
  ".mp3",
  ".wav",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
]);

async function buildRepositoryFileTree(repositoryPath) {
  if (!repositoryPath) {
    throw new Error("Repository path is required");
  }

  const result = [];

  async function traverse(currentPath, parentRelativePath) {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch (error) {
      throw new Error(`Cannot read directory ${currentPath}: ${error.message}`);
    }

    // Sort alphabetically for deterministic output
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

        const entryPath = path.join(currentPath, entry.name);
        await traverse(entryPath, entryRelativePath);
      } else if (entry.isFile()) {
        // Skip .env and .env.* files
        if (entry.name === ".env" || entry.name.startsWith(".env.")) {
          continue;
        }

        // Skip ignored extensions
        const ext = path.extname(entry.name);
        if (IGNORED_EXTENSIONS.has(ext)) {
          continue;
        }

        result.push({
          path: entryRelativePath,
          name: entry.name,
          type: "file",
          extension: ext || null,
          parentPath: parentRelativePath || null,
        });
      }
    }
  }

  await traverse(repositoryPath, "");

  // Convert paths to forward slashes for Windows compatibility
  result.forEach((entry) => {
    entry.path = entry.path.split(path.sep).join("/");
    if (entry.parentPath) {
      entry.parentPath = entry.parentPath
        ? entry.parentPath.split(path.sep).join("/")
        : null;
    }
  });

  return result;
}

module.exports = { buildRepositoryFileTree };
