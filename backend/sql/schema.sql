-- Enable cryptographic functions for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

--------------------------------------------------------------------------------
-- Repositories
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
-- Repositories
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    github_url TEXT NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'queued',

    ai_index_status VARCHAR(30) NOT NULL DEFAULT 'pending',

    default_branch VARCHAR(255),

    latest_commit_sha TEXT,

    indexed_at TIMESTAMPTZ,

    last_checked_at TIMESTAMPTZ,

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
    ),

    CONSTRAINT repositories_ai_index_status_check CHECK (
        ai_index_status IN (
            'pending',
            'indexing',
            'completed',
            'failed'
        )
    )
);

--------------------------------------------------------------------------------
-- Repository Files
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS repository_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repository_id UUID NOT NULL
        REFERENCES repositories(id)
        ON DELETE CASCADE,

    path TEXT NOT NULL,

    name VARCHAR(255) NOT NULL,

    type VARCHAR(20) NOT NULL,

    extension VARCHAR(50),

    parent_path TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT repository_files_type_check
        CHECK (type IN ('file', 'directory')),

    CONSTRAINT repository_files_repository_path_unique
        UNIQUE (repository_id, path)
);

--------------------------------------------------------------------------------
-- Repository File Contents
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS repository_file_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repository_file_id UUID NOT NULL
        REFERENCES repository_files(id)
        ON DELETE CASCADE,

    content TEXT NOT NULL,

    size_bytes INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Repository Embeddings
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS repository_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repository_file_id UUID NOT NULL
        REFERENCES repository_files(id)
        ON DELETE CASCADE,

    chunk_index INTEGER NOT NULL,

    chunk_text TEXT NOT NULL,

    embedding VECTOR(384) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Users (Google Authentication)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    google_id TEXT NOT NULL UNIQUE,

    email VARCHAR(255) NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    picture TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- User Repository Mapping
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_repositories (
    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    repository_id UUID NOT NULL
        REFERENCES repositories(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, repository_id)
);

--------------------------------------------------------------------------------
-- repository technologies 
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS repository_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,

    technology VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (repository_id, technology)
);


--------------------------------------------------------------------------------
-- Indexes
--------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_repository_file_contents_file_id
ON repository_file_contents(repository_file_id);

CREATE INDEX IF NOT EXISTS idx_repository_files_repository_id
ON repository_files(repository_id);

CREATE INDEX IF NOT EXISTS idx_repository_files_parent_path
ON repository_files(parent_path);

CREATE INDEX IF NOT EXISTS idx_repository_embeddings_file
ON repository_embeddings(repository_file_id);

CREATE INDEX IF NOT EXISTS idx_repository_embeddings_vector
ON repository_embeddings
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_user_repositories_user
ON user_repositories(user_id);

CREATE INDEX IF NOT EXISTS idx_user_repositories_repository
ON user_repositories(repository_id);