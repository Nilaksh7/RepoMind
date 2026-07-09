const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const {
  semanticSearch,
} = require("../controllers/repository-search.controller");

const router = express.Router();

router.use(authenticate);

router.get("/:repositoryId/search", semanticSearch);

module.exports = router;
