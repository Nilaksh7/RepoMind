const pool = require("../config/db");

async function findRepositoryByGitHubUrl(githubUrl) {
  const result = await pool.query(
    "SELECT id, github_url, name, status, default_branch, created_at, updated_at FROM repositories WHERE github_url = $1",
    [githubUrl],
  );
  return result.rows[0] || null;
}

async function createRepository({ githubUrl, name }) {
  const result = await pool.query(
    "INSERT INTO repositories (github_url, name, status) VALUES ($1, $2, $3) RETURNING id, github_url, name, status, default_branch, created_at, updated_at",
    [githubUrl, name, "queued"],
  );
  return result.rows[0];
}

async function updateRepositoryStatus(id, status) {
  const result = await pool.query(
    "UPDATE repositories SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING id, github_url, name, status, default_branch, created_at, updated_at",
    [id, status],
  );
  if (result.rows.length === 0) {
    throw new Error(`Repository with id ${id} not found`);
  }
  return result.rows[0];
}

async function deleteRepositoryById(id) {
  await pool.query("DELETE FROM repositories WHERE id = $1", [id]);
}

module.exports = {
  findRepositoryByGitHubUrl,
  createRepository,
  updateRepositoryStatus,
  deleteRepositoryById,
};
