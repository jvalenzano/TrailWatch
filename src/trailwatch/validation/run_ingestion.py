import asyncio
from src.trailwatch.validation.data_ingestion import download_usfs_geodata, unzip_geodata, import_geodata

async def main():
    await download_usfs_geodata()
    unzip_geodata()
    await import_geodata()

if __name__ == "__main__":
    asyncio.run(main())
