const pool = require("../config/db");

async function getRepositoryReadmeFile(repositoryId, client) {
  const db = client || pool;

  const query = `
    SELECT
      repository_files.id,
      repository_files.path,
      repository_files.name,
      repository_files.extension,
      repository_file_contents.content,
      repository_file_contents.size_bytes AS "sizeBytes"
    FROM repository_files
    INNER JOIN repository_file_contents
      ON repository_file_contents.repository_file_id = repository_files.id
    WHERE repository_files.repository_id = $1
      AND LOWER(repository_files.name) IN (
        'readme.md',
        'readme.mdx',
        'readme.txt',
        'readme'
      )
    ORDER BY
      CASE
        WHEN LOWER(repository_files.name) = 'readme.md' THEN 1
        WHEN LOWER(repository_files.name) = 'readme.mdx' THEN 2
        WHEN LOWER(repository_files.name) = 'readme.txt' THEN 3
        ELSE 4
      END
    LIMIT 1;
  `;

  const result = await db.query(query, [repositoryId]);

  return result.rows[0] || null;
}

module.exports = {
  getRepositoryReadmeFile,
};
