import pytest
from sqlalchemy import create_engine, text
from src.trailwatch.core.config import settings


def test_db_connection(db_engine):
    # If the fixture completes without exception, the connection is successful
    assert db_engine is not None
