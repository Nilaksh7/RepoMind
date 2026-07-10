const fs = require("fs/promises");
const path = require("path");
const { isBinaryFile } = require("isbinaryfile");

const SKIPPED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",

  ".pdf",

  ".zip",
  ".tar",
  ".gz",
  ".7z",

  ".exe",
  ".dll",
  ".so",
  ".dylib",

  ".mp3",
  ".mp4",
  ".mov",
  ".avi",
]);

function shouldReadFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return !SKIPPED_EXTENSIONS.has(extension);
}

async function readRepositoryFileContents(repositoryRootPath, files) {
  const contents = [];

  for (const file of files) {
    if (file.type !== "file") {
      continue;
    }

    if (!shouldReadFile(file.path)) {
      continue;
    }

    const absolutePath = path.join(repositoryRootPath, file.path);

    try {
      // Skip binary files
      if (await isBinaryFile(absolutePath)) {
        console.warn(`Skipping binary file: ${file.path}`);
        continue;
      }

      const rawContent = await fs.readFile(absolutePath, "utf8");

      // PostgreSQL TEXT cannot contain NULL bytes.
      const content = rawContent.replace(/\0/g, "");

      contents.push({
        repositoryFileId: file.id,
        content,
        sizeBytes: Buffer.byteLength(content, "utf8"),
      });
    } catch (error) {
      console.warn(`Skipping unreadable file: ${file.path}`);
    }
  }

  return contents;
}

module.exports = {
  readRepositoryFileContents,
};
