const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const repositoryRoutes = require("./routes/repository.routes");
const repositoryTreeRoutes = require("./routes/repository-tree.routes");
const repositoryFileContentRoutes = require("./routes/repository-file-content.routes");
const repositoryStatisticsRoutes = require("./routes/repository-statistics.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);

app.use("/api/repositories", repositoryRoutes);

app.use("/api/repositories", repositoryTreeRoutes);

app.use("/api/repositories", repositoryFileContentRoutes);

app.use("/api/repositories", repositoryStatisticsRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;
