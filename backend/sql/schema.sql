CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_url TEXT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  default_branch VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT repositories_status_check CHECK (
  status IN (
    'queued',
    'cloning',
    'imported',
    'analyzing',
    'completed',
    'failed'
  )
));

CREATE TABLE IF NOT EXISTS repository_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  extension VARCHAR(50),
  parent_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repository_files_type_check CHECK (type IN ('file', 'directory')),
  CONSTRAINT repository_files_repository_path_unique UNIQUE (repository_id, path)
);

CREATE TABLE repository_file_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repository_file_id UUID NOT NULL
        REFERENCES repository_files(id)
        ON DELETE CASCADE,

    content TEXT NOT NULL,

    size_bytes INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_repository_file_contents_file_id ON repository_file_contents(repository_file_id);
CREATE INDEX IF NOT EXISTS idx_repository_files_repository_id ON repository_files(repository_id);
CREATE INDEX IF NOT EXISTS idx_repository_files_parent_path ON repository_files(parent_path);
