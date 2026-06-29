const express = require("express");
const { getRepositoryTreeController } = require("../controllers/repository-tree.controller");

const router = express.Router();

router.get("/:repositoryId/tree", getRepositoryTreeController);

module.exports = router;
