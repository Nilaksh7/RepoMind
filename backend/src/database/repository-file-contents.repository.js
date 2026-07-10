const pool = require("../config/db");

async function saveRepositoryFileContents(entries, client) {
  const db = client || pool;

  if (!entries.length) return;

  const BATCH_SIZE = 1000;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    const values = [];
    const placeholders = [];

    batch.forEach((entry, index) => {
      const start = index * 3 + 1;

      placeholders.push(`($${start}, $${start + 1}, $${start + 2})`);

      values.push(entry.repositoryFileId, entry.content, entry.sizeBytes);
    });

    const query = `
      INSERT INTO repository_file_contents (
        repository_file_id,
        content,
        size_bytes
      )
      VALUES ${placeholders.join(", ")}
    `;

    await db.query(query, values);
  }
}

async function getRepositoryFileContent(repositoryId, fileId, client) {
  const db = client || pool;

  const query = `
    SELECT
  repository_files.id,
  repository_files.path,
  repository_files.extension,
  repository_file_contents.content,
  repository_file_contents.size_bytes AS "sizeBytes"
FROM repository_files
JOIN repository_file_contents
  ON repository_file_contents.repository_file_id = repository_files.id
WHERE repository_files.repository_id = $1
  AND repository_files.id = $2
  `;

  const result = await db.query(query, [repositoryId, fileId]);

  if (result.rows.length === 0) {
    console.log("Missing file:", {
      repositoryId,

      fileId,
    });
  }

  return result.rows[0] || null;
}

module.exports = {
  saveRepositoryFileContents,
  getRepositoryFileContent,
};
