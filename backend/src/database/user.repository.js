const pool = require("../config/db");

async function findUserByGoogleId(googleId, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      id,
      google_id,
      email,
      name,
      picture,
      created_at,
      updated_at
    FROM users
    WHERE google_id = $1
    `,
    [googleId],
  );

  return result.rows[0] || null;
}

async function findUserByEmail(email, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      id,
      google_id,
      email,
      name,
      picture,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] || null;
}

async function findUserById(userId, client) {
  const db = client || pool;

  const result = await db.query(
    `
    SELECT
      id,
      google_id,
      email,
      name,
      picture,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    `,
    [userId],
  );

  return result.rows[0] || null;
}

async function createGoogleUser({ googleId, email, name, picture }, client) {
  const db = client || pool;

  const result = await db.query(
    `
    INSERT INTO users (
      google_id,
      email,
      name,
      picture
    )
    VALUES ($1, $2, $3, $4)

    RETURNING
      id,
      google_id,
      email,
      name,
      picture,
      created_at,
      updated_at
    `,
    [googleId, email, name, picture],
  );

  return result.rows[0];
}

async function updateGoogleUser(userId, { email, name, picture }, client) {
  const db = client || pool;

  const result = await db.query(
    `
    UPDATE users
    SET
      email = $2,
      name = $3,
      picture = $4,
      updated_at = NOW()
    WHERE id = $1

    RETURNING
      id,
      google_id,
      email,
      name,
      picture,
      created_at,
      updated_at
    `,
    [userId, email, name, picture],
  );

  return result.rows[0];
}

module.exports = {
  findUserByGoogleId,
  findUserByEmail,
  findUserById,
  createGoogleUser,
  updateGoogleUser,
};
