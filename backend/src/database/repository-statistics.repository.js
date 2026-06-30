const pool = require("../config/db");

async function getRepositoryStatistics(repositoryId, client) {
  const db = client || pool;

  const query = `
    SELECT
      COUNT(*) FILTER (WHERE rf.type = 'file') AS "totalFiles",
COUNT(*) FILTER (WHERE rf.type = 'directory') AS "totalDirectories",
COALESCE(SUM(rfc.size_bytes), 0) AS "totalSizeBytes"
    FROM repository_files rf
    LEFT JOIN repository_file_contents rfc
      ON rfc.repository_file_id = rf.id
    WHERE rf.repository_id = $1
  `;

  const result = await db.query(query, [repositoryId]);
  return result.rows[0];
}

async function getLanguageStatistics(repositoryId, client) {
  const db = client || pool;

  const query = `
    SELECT
      extension,
      COUNT(*) AS "count"
    FROM repository_files
    WHERE repository_id = $1
      AND type = 'file'
      AND extension IS NOT NULL
    GROUP BY extension
    ORDER BY COUNT(*) DESC
  `;

  const result = await db.query(query, [repositoryId]);
  return result.rows;
}

async function getLargestFiles(repositoryId, limit = 10, client) {
  const db = client || pool;

  const query = `
    SELECT
      rf.id,
      rf.path,
      rf.extension,
      rfc.size_bytes AS "sizeBytes"
    FROM repository_files rf
    JOIN repository_file_contents rfc
      ON rfc.repository_file_id = rf.id
    WHERE rf.repository_id = $1
    ORDER BY rfc.size_bytes DESC
    LIMIT $2
  `;

  const result = await db.query(query, [repositoryId, limit]);
  return result.rows;
}

module.exports = {
  getRepositoryStatistics,
  getLanguageStatistics,
  getLargestFiles,
};
