const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  getRepositoryFileContentController,
} = require("../controllers/repository-file-content.controller");

const router = express.Router();

router.use(authenticate);

router.get("/:repositoryId/files/:fileId", getRepositoryFileContentController);

module.exports = router;
