const pool = require("../config/db");

async function createUserRepositoryMapping(userId, repositoryId, client) {
  const db = client || pool;

  await db.query(
    `
    INSERT INTO user_repositories (
      user_id,
      repository_id
    )
    VALUES ($1, $2)
    ON CONFLICT (user_id, repository_id)
    DO NOTHING
    `,
    [userId, repositoryId],
  );
}

async function findRepositoryForUser(userId, githubUrl, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      r.*
    FROM repositories r
    INNER JOIN user_repositories ur
      ON ur.repository_id = r.id
    WHERE
      ur.user_id = $1
      AND r.github_url = $2
    `,
    [userId, githubUrl],
  );

  return result.rows[0] || null;
}

async function getRepositoriesForUser(userId, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      r.id,
      r.name,
      r.github_url,
      r.status,
      r.default_branch,
      r.latest_commit_sha,
      r.indexed_at,
      r.last_checked_at,
      ur.created_at AS imported_at
    FROM user_repositories ur
    INNER JOIN repositories r
      ON r.id = ur.repository_id
    WHERE ur.user_id = $1
    ORDER BY ur.created_at DESC
    `,
    [userId],
  );

  return result.rows;
}

//For opening from the dashboard we have the repository ID.
async function findRepositoryByIdForUser(userId, repositoryId, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      r.*
    FROM repositories r
    INNER JOIN user_repositories ur
      ON ur.repository_id = r.id
    WHERE
      ur.user_id = $1
      AND r.id = $2
    `,
    [userId, repositoryId],
  );

  return result.rows[0] || null;
}

module.exports = {
  createUserRepositoryMapping,
  findRepositoryForUser,
  getRepositoriesForUser,
  findRepositoryByIdForUser,
};
