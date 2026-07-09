const { loginWithGoogle } = require("../services/auth.service");

async function googleLoginController(req, res, next) {
  try {
    const { credential } = req.body;

    if (!credential) {
      const error = new Error("Google credential is required");
      error.statusCode = 400;
      throw error;
    }

    const { accessToken, user } = await loginWithGoogle(credential);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  googleLoginController,
};
