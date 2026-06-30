const express = require("express");

const {
  getRepositoryStatisticsController,
} = require("../controllers/repository-statistics.controller");

const router = express.Router();

router.get("/:repositoryId/statistics", getRepositoryStatisticsController);

module.exports = router;
