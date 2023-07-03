import chromadb
import os
from chromadb.config import Settings
client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet",
                                  persist_directory=os.path.join(
                                      os.path.dirname(__file__), "db")
                                  ))


def get_client():
    return client


def search(query: str) -> str:
    return "d"
