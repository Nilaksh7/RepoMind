const fs = require("fs/promises");
const path = require("path");

async function detectRepositoryTechnologies(repositoryPath, repositoryFiles) {
  const technologies = new Set();

  for (const file of repositoryFiles) {
    const filePath = file.path;
    const fileName = path.basename(filePath);

    // ----------------------------
    // File-based detection
    // ----------------------------

    switch (fileName) {
      case "package.json":
        technologies.add("Node.js");
        break;

      case "requirements.txt":
      case "pyproject.toml":
        technologies.add("Python");
        break;

      case "go.mod":
        technologies.add("Go");
        break;

      case "Cargo.toml":
        technologies.add("Rust");
        break;

      case "pom.xml":
      case "build.gradle":
      case "build.gradle.kts":
        technologies.add("Java");
        break;

      case "Dockerfile":
        technologies.add("Docker");
        break;

      case "docker-compose.yml":
      case "docker-compose.yaml":
        technologies.add("Docker Compose");
        break;

      case "tsconfig.json":
        technologies.add("TypeScript");
        break;

      case "tailwind.config.js":
      case "tailwind.config.ts":
        technologies.add("Tailwind CSS");
        break;

      case "vite.config.js":
      case "vite.config.ts":
        technologies.add("Vite");
        break;

      case "next.config.js":
      case "next.config.mjs":
        technologies.add("Next.js");
        break;
    }

    // ----------------------------
    // package.json detection
    // ----------------------------

    if (fileName === "package.json") {
      try {
        const content = await fs.readFile(
          path.join(repositoryPath, filePath),
          "utf8",
        );

        const pkg = JSON.parse(content);

        const dependencies = {
          ...pkg.dependencies,
          ...pkg.devDependencies,
        };

        if (dependencies.react) technologies.add("React");
        if (dependencies.express) technologies.add("Express");
        if (dependencies.mongodb) technologies.add("MongoDB");
        if (dependencies.mongoose) technologies.add("MongoDB");
        if (dependencies.pg) technologies.add("PostgreSQL");
        if (dependencies.prisma) technologies.add("Prisma");
        if (dependencies.redis) technologies.add("Redis");
        if (dependencies.tailwindcss) technologies.add("Tailwind CSS");
        if (dependencies["react-router-dom"]) technologies.add("React Router");
        if (dependencies.vite) technologies.add("Vite");
      } catch {
        // Ignore invalid package.json
      }
    }

    // ----------------------------
    // Python detection
    // ----------------------------

    if (fileName === "requirements.txt" || fileName === "pyproject.toml") {
      try {
        const content = await fs.readFile(
          path.join(repositoryPath, filePath),
          "utf8",
        );

        const text = content.toLowerCase();

        if (text.includes("fastapi")) technologies.add("FastAPI");

        if (text.includes("flask")) technologies.add("Flask");

        if (text.includes("django")) technologies.add("Django");

        if (text.includes("sqlalchemy")) technologies.add("SQLAlchemy");
      } catch {}
    }
  }

  return [...technologies].sort();
}

module.exports = {
  detectRepositoryTechnologies,
};
