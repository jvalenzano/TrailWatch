import asyncio
from src.trailwatch.validation.database import create_postgis_extensions, create_tables

async def main():
    print("Creating PostGIS extensions...")
    await create_postgis_extensions()
    print("PostGIS extensions created.")
    print("Creating tables...")
    await create_tables()
    print("Tables created.")

if __name__ == "__main__":
    asyncio.run(main())
