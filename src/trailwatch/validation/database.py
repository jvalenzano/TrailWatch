from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text

from .core.config import settings


from .models import Base


async def create_postgis_extensions():
    """Connects to the database and creates the PostGIS extensions."""
    # We need a non-async engine to create extensions, as it's a one-off setup task.
    # Using a sync engine for this is simpler than managing the async context for a single command.
    from sqlalchemy import create_engine

    # Construct a sync database URL from the async one.
    sync_db_url = settings.VALIDATION_DATABASE_URL.replace("+asyncpg", "")

    engine = create_engine(sync_db_url)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis_topology;"))
        conn.commit()


async def create_tables():
    """Connects to the database and creates all tables."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Async engine for the application
async_engine = create_async_engine(settings.VALIDATION_DATABASE_URL, echo=True)

# Async session factory
AsyncSessionFactory = sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)
