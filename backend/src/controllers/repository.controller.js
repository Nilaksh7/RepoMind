const { importRepository } = require("../services/repository-import.service");

async function importRepositoryController(req, res, next) {
  try {
    const { githubUrl } = req.body;

    const repository = await importRepository(githubUrl);

    return res.status(201).json({
      success: true,
      repository: {
        id: repository.id,
        name: repository.name,
        githubUrl: repository.github_url,
        status: repository.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { importRepositoryController };
