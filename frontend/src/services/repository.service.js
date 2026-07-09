import api from "./api";

export async function importRepository(githubUrl) {
  const response = await api.post("/repositories/import", {
    githubUrl,
  });

  return response.data;
}

export async function getRepositories() {
  const response = await api.get("/repositories");

  return response.data;
}

export async function getRepository(repositoryId) {
  const response = await api.get(`/repositories/${repositoryId}`);

  return response.data;
}

export async function getRepositoryTree(repositoryId) {
  const response = await api.get(`/repositories/${repositoryId}/tree`);

  return response.data;
}

export async function getRepositoryStatistics(repositoryId) {
  const response = await api.get(`/repositories/${repositoryId}/statistics`);

  return response.data;
}

export async function getRepositoryFile(repositoryId, fileId) {
  const response = await api.get(
    `/repositories/${repositoryId}/files/${fileId}`,
  );

  return response.data;
}

export async function askRepositoryQuestion(repositoryId, question) {
  const response = await api.post(`/chat/${repositoryId}`, {
    question,
  });

  return response.data;
}

export async function openRepository(repositoryId) {
  const response = await api.get(`/repositories/${repositoryId}`);

  return response.data;
}

export async function getRepositoryReadme(repositoryId) {
  const response = await api.get(`/repositories/${repositoryId}/readme`);

  return response.data;
}

export async function getRepositorySummary(repositoryId) {
  const response = await api.post(`/repositories/${repositoryId}/summary`);

  return response.data;
}

export async function explainRepositoryFile(repositoryId, fileId) {
  const response = await api.post(
    `/repositories/${repositoryId}/files/${fileId}/explain`,
  );

  return response.data;
}

export async function getDependencyGraph(repositoryId) {
  const response = await api.get(`/chat/${repositoryId}/dependency-graph`);

  return response.data;
}

export async function searchRepository(repositoryId, query, limit = 10) {
  const response = await api.get(`/repositories/${repositoryId}/search`, {
    params: {
      query,
      limit,
    },
  });

  return response.data;
}
