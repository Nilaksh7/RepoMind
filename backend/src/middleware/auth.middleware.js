const { verifyAccessToken } = require("../utils/jwt");

const { findUserById } = require("../database/user.repository");

async function authenticate(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      const error = new Error("Authorization header is missing");
      error.statusCode = 401;
      throw error;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const error = new Error("Invalid authorization header");
      error.statusCode = 401;
      throw error;
    }

    const token = authorizationHeader.substring(7);

    const payload = verifyAccessToken(token);

    const user = await findUserById(payload.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}

module.exports = {
  authenticate,
};
