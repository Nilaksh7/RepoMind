const pool = require("../config/db");

async function findRepositoryByGitHubUrl(githubUrl, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
        id,
        github_url,
        name,
        status,
        default_branch,
        latest_commit_sha,
        indexed_at,
        last_checked_at,
        created_at,
        updated_at
    FROM repositories
    WHERE github_url = $1
    `,
    [githubUrl],
  );

  return result.rows[0] || null;
}

async function createRepository(
  { githubUrl, name, defaultBranch, latestCommitSha },
  client,
) {
  const db = client || pool;

  const result = await db.query(
    `
    INSERT INTO repositories (
        github_url,
        name,
        status,
        default_branch,
        latest_commit_sha,
        indexed_at,
        last_checked_at
    )
    VALUES ($1,$2,$3,$4,$5,NOW(),NOW())

    RETURNING
        id,
        github_url,
        name,
        status,
        default_branch,
        latest_commit_sha,
        indexed_at,
        last_checked_at,
        created_at,
        updated_at
    `,
    [githubUrl, name, "queued", defaultBranch, latestCommitSha],
  );

  return result.rows[0];
}

async function updateRepositoryStatus(id, status, client) {
  const db = client || pool;
  const result = await db.query(
    "UPDATE repositories SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING id, github_url, name, status, default_branch, latest_commit_sha, indexed_at, last_checked_at, created_at, updated_at",
    [id, status],
  );
  if (result.rows.length === 0) {
    throw new Error(`Repository with id ${id} not found`);
  }
  return result.rows[0];
}

async function deleteRepositoryById(id, client) {
  const db = client || pool;
  await db.query("DELETE FROM repositories WHERE id = $1", [id]);
}

async function findRepositoryById(id, client) {
  const db = client || pool;
  const result = await db.query(
    `SELECT
        id,
        github_url,
        name,
        status,
        default_branch,
        latest_commit_sha,
        indexed_at,
        last_checked_at,
        created_at,
        updated_at
    FROM repositories
    WHERE id = $1;`,
    [id],
  );
  return result.rows[0] || null;
}

async function updateRepositoryVersion(
  repositoryId,
  { latestCommitSha, defaultBranch },
  client,
) {
  const db = client || pool;

  const result = await db.query(
    `
    UPDATE repositories
    SET
      latest_commit_sha = $2,
      default_branch = $3,
      indexed_at = NOW(),
      last_checked_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [repositoryId, latestCommitSha, defaultBranch],
  );
  return result.rows[0];
}

async function updateRepositoryLastChecked(repositoryId, client) {
  const db = client || pool;

  await db.query(
    `
    UPDATE repositories
    SET
      last_checked_at = NOW()
    WHERE id = $1
    `,
    [repositoryId],
  );
}

async function updateRepositoryMetadata(
  repositoryId,
  { status, defaultBranch, latestCommitSha },
  client,
) {
  const db = client || pool;

  const result = await db.query(
    `
    UPDATE repositories
    SET
      status = $2,
      default_branch = $3,
      latest_commit_sha = $4,
      indexed_at = NOW(),
      last_checked_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [repositoryId, status, defaultBranch, latestCommitSha],
  );

  return result.rows[0];
}

module.exports = {
  findRepositoryByGitHubUrl,
  updateRepositoryVersion,
  createRepository,
  updateRepositoryStatus,
  updateRepositoryLastChecked,
  deleteRepositoryById,
  findRepositoryById,
  updateRepositoryMetadata,
};
