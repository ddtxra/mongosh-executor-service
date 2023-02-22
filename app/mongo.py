from fastapi import APIRouter
import subprocess
import logging
from datetime import datetime
import json
from pymongo import MongoClient

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

router = APIRouter()

client = MongoClient("mongodb://danimar/")
db = client.crypto

@router.get("/query")
def execute_mongo_query(server: str, query_id: str):
    logger.info("this will get printed")

    print("Current Time =", datetime.now().strftime("%H:%M:%S"))

    # Build the command to execute
    server_uri = server
    db_name = "crypto"
    mongo_cmd = f"mongosh --quiet --norc {server_uri}/{db_name} query.js"

    logger.info("Executing cmd" + mongo_cmd)

    # Execute the command and capture its output
    process = subprocess.Popen(mongo_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    stdout, stderr = process.communicate()

    # Stream the output to the client as it becomes available
    bytes_read = 0
    while True:
        output = stdout.readline()
        if output == b'' and process.poll() is not None:
            break
        if output:
            bytes_read += len(output)
            yield json.loads(str(output.decode()))

    # Wait for the process to exit and get its return code
    return_code = process.wait()

    # If the process failed, raise an exception
    if return_code != 0:
        error_output = stderr.read().decode().strip()
        raise Exception(f"Query execution failed with return code {return_code}: {error_output}")

    logger.info(f"Query generated {bytes_read} bytes of output")
