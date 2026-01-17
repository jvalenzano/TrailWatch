import pytest
from sqlalchemy import create_engine, text
from src.trailwatch.core.config import settings

@pytest.fixture(scope="session")
def db_engine():
    # Use the database_url from settings for testing
    engine = create_engine(settings.database_url)
    with engine.connect() as connection:
        # Try to execute a simple query to check the connection
        connection.execute(text("SELECT 1"))
    yield engine
    engine.dispose()
