const express = require("express");
const {
  getRepositoryFileContentController,
} = require("../controllers/repository-file-content.controller");

const router = express.Router();

router.get("/:repositoryId/files/:fileId", getRepositoryFileContentController);

module.exports = router;
