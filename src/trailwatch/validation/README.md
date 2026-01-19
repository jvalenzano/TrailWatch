# Trail Validation Service

This service validates GPS coordinates against the USFS trail dataset.

## Setup

1.  **Create a PostgreSQL database with PostGIS enabled.**
2.  **Create a database user** with permissions to create tables and write to the database.
3.  **Set up the environment.** Copy the `.env.validation.example` to `.env.validation` and fill in the database credentials and the USFS geodata URL.

    ```bash
    cp .env.validation.example .env.validation
    ```

4.  **Install dependencies.**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Create the database extensions and tables.** Run the following script:

    ```bash
    python -m src.trailwatch.validation.setup_db
    ```

## Data Ingestion

To download the USFS trail data and import it into the database, run the following command:

```bash
python -m src.trailwatch.validation.run_ingestion
```

This will download a large file ( >100MB) and may take some time.

### Quarterly Refresh Automation

To automate the data refresh, you can set up a cron job to run the ingestion script quarterly. For example, to run the script at midnight on the first day of January, April, July, and October, add the following line to your crontab:

```
0 0 1 1,4,7,10 * /path/to/your/project/.venv/bin/python -m src.trailwatch.validation.run_ingestion
```

## Running the service

To run the validation service, use uvicorn:

```bash
uvicorn src.trailwatch.validation.main:app --reload
```
