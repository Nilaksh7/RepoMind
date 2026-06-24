const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.status(200).json({
      success: true,
      message: "RepoMind AI API is healthy",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
