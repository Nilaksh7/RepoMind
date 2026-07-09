const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  getRepositoryTreeController,
} = require("../controllers/repository-tree.controller");

const router = express.Router();

router.use(authenticate);

router.get("/:repositoryId/tree", getRepositoryTreeController);

module.exports = router;
