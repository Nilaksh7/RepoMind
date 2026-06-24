const express = require("express");
const {
  importRepositoryController,
} = require("../controllers/repository.controller");

const router = express.Router();

router.post("/import", importRepositoryController);

module.exports = router;
