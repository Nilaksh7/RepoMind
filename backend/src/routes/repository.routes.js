const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  importRepositoryController,
  getDashboardRepositoriesController,
  openRepositoryController,
} = require("../controllers/repository.controller");

const {
  getRepositoryTreeController,
} = require("../controllers/repository-tree.controller");

const {
  getRepositoryFileContentController,
} = require("../controllers/repository-file-content.controller");

const {
  getRepositoryStatisticsController,
} = require("../controllers/repository-statistics.controller");

const {
  getRepositoryReadmeController,
} = require("../controllers/repository-readme.controller");

const {
  getRepositorySummaryController,
} = require("../controllers/repository-summary.controller");

const router = express.Router();

router.use(authenticate);

router.get("/", getDashboardRepositoriesController);

router.post("/import", importRepositoryController);

router.get("/:repositoryId", openRepositoryController);

router.post("/:repositoryId/summary", getRepositorySummaryController);

router.get("/:repositoryId/tree", getRepositoryTreeController);

router.get("/:repositoryId/statistics", getRepositoryStatisticsController);

router.get("/:repositoryId/readme", getRepositoryReadmeController);

router.get("/:repositoryId/files/:fileId", getRepositoryFileContentController);

module.exports = router;
