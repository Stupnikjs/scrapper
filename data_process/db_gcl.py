import os
import ssl
from sqlalchemy import text
import sqlalchemy

def connect_tcp_socket() -> sqlalchemy.engine.base.Engine:
    """Initializes a TCP connection pool for a Cloud SQL instance of Postgres."""
    # Note: Saving credentials in environment variables is convenient, but not
    # secure - consider a more secure solution such as
    # Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
    # keep secrets safe.
    db_host = '34.155.67.147' # os.environ["INSTANCE_HOST"]  # e.g. '127.0.0.1' ('172.17.0.1' if deployed to GAE Flex) => public 
    db_user = 'postgres' # os.environ["DB_USER"]  # e.g. 'my-db-user'
    db_pass = 'postgres' # os.environ["DB_PASS"]  # e.g. 'my-db-password'
    db_name = 'andredb' # os.environ["DB_NAME"]  # e.g. 'my-database'
    db_port = '5432' # os.environ["DB_PORT"]  # e.g. 5432

    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # postgresql+pg8000://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+pg8000",
            username=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            database=db_name,
        ),
        # ...
    )
    return pool

pool = connect_tcp_socket()

with pool.connect() as conn:
    conn.execute(text('CREATE DATABASE michou'))
    conn.commit()
