const express = require("express");

const { googleLoginController } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/google", googleLoginController);

module.exports = router;
