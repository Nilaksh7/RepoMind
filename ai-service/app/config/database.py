"""Shared PostgreSQL connection pool configuration."""

import os

from dotenv import load_dotenv
from pgvector.psycopg import register_vector
from psycopg_pool import ConnectionPool

load_dotenv()

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=1,
    max_size=10,
    configure=register_vector,
)