const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  askQuestion,
  getDependencyGraph,
} = require("../controllers/chat.controller");

const router = express.Router();

router.use(authenticate);

router.post("/:repositoryId", askQuestion);

router.get("/:repositoryId/dependency-graph", getDependencyGraph);

module.exports = router;
