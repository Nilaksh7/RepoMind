const pool = require("../config/db");

async function saveRepositoryFiles(repositoryId, entries, client) {
  const db = client || pool;

  if (!Array.isArray(entries) || entries.length === 0) {
    return;
  }

  const values = [];
  const placeholders = [];

  entries.forEach((entry, index) => {
    const startIndex = index * 6 + 1;
    const rowPlaceholders = Array.from(
      { length: 6 },
      (_, offset) => `$${startIndex + offset}`,
    ).join(", ");

    placeholders.push(`(${rowPlaceholders})`);
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
    RETURNING id, path, type;
  `;

  const result = await db.query(query, values);
  return result.rows;
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

module.exports = {
  saveRepositoryFiles,
  getRepositoryFiles,
};
