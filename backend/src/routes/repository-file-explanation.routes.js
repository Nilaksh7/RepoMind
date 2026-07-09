const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  explainRepositoryFileController,
} = require("../controllers/repository-file-explanation.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/:repositoryId/files/:fileId/explain",
  explainRepositoryFileController,
);

module.exports = router;
