const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  getRepositoryStatisticsController,
} = require("../controllers/repository-statistics.controller");

const router = express.Router();

router.use(authenticate);

router.get("/:repositoryId/statistics", getRepositoryStatisticsController);

module.exports = router;
