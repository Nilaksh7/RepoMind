const pool = require("../config/db");

async function saveRepositoryTechnologies(
  repositoryId,
  technologies,
  client = pool,
) {
  for (const technology of technologies) {
    await client.query(
      `
      INSERT INTO repository_technologies (
        repository_id,
        technology
      )
      VALUES ($1, $2)
      ON CONFLICT (repository_id, technology)
      DO NOTHING
      `,
      [repositoryId, technology],
    );
  }
}

async function getRepositoryTechnologies(repositoryId) {
  const { rows } = await pool.query(
    `
    SELECT technology
    FROM repository_technologies
    WHERE repository_id = $1
    ORDER BY technology
    `,
    [repositoryId],
  );

  return rows.map((row) => row.technology);
}

async function deleteRepositoryTechnologies(repositoryId, client = pool) {
  await client.query(
    `
    DELETE FROM repository_technologies
    WHERE repository_id = $1
    `,
    [repositoryId],
  );
}

module.exports = {
  saveRepositoryTechnologies,
  getRepositoryTechnologies,
  deleteRepositoryTechnologies,
};
