const { OAuth2Client } = require("google-auth-library");

const {
  findUserByGoogleId,
  createGoogleUser,
  updateGoogleUser,
} = require("../database/user.repository");

const { generateAccessToken } = require("../utils/jwt");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function loginWithGoogle(credential) {
  // Step 1: Verify Google ID Token
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // Step 2: Extract Google profile
  const payload = ticket.getPayload();

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name;
  const picture = payload.picture;

  // Step 3: Find existing user
  let user = await findUserByGoogleId(googleId);

  // Step 4: First login → Create user
  if (!user) {
    user = await createGoogleUser({
      googleId,
      email,
      name,
      picture,
    });
  }

  // Step 5: Existing user → Update latest profile
  else {
    user = await updateGoogleUser(user.id, {
      email,
      name,
      picture,
    });
  }

  // Step 6: Generate RepoMind JWT
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
    user,
  };
}

module.exports = {
  loginWithGoogle,
};
