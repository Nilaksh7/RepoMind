const pool = require("../config/db");

async function saveRepositoryFiles(repositoryId, entries, client) {
  const db = client || pool;

  if (!entries.length) return;

  const BATCH_SIZE = 1000;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    const values = [];
    const placeholders = [];

    batch.forEach((entry, index) => {
      const start = index * 6 + 1;

      placeholders.push(
        `($${start}, $${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5})`,
      );

      values.push(
        repositoryId,
        entry.path,
        entry.name,
        entry.type,
        entry.extension,
        entry.parentPath,
      );
    });

    const query = `
      INSERT INTO repository_files (
        repository_id,
        path,
        name,
        type,
        extension,
        parent_path
      )
      VALUES ${placeholders.join(", ")}
    `;

    await db.query(query, values);
  }
}

async function getRepositoryFiles(repositoryId, client) {
  const db = client || pool;
  const query = `
    SELECT
      id,
      repository_id,
      path,
      name,
      type,
      extension,
      parent_path,
      created_at
    FROM repository_files
    WHERE repository_id = $1
    ORDER BY path ASC
  `;

  const result = await db.query(query, [repositoryId]);
  return result.rows;
}

async function deleteRepositoryFiles(repositoryId, client) {
  const db = client || pool;

  await db.query(
    `
    DELETE FROM repository_files
    WHERE repository_id = $1
    `,
    [repositoryId],
  );
}

module.exports = {
  saveRepositoryFiles,
  getRepositoryFiles,
  deleteRepositoryFiles,
};
