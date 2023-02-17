from fastapi import APIRouter
import subprocess
import logging


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter()

@router.post("/query")
async def execute_mongo_query(query: str):
    # Build the command to execute
    server_uri = "danimar"
    db_name = "test"
    mongo_cmd = f"mongosh --quiet --norc --eval 'JSON.stringify({query})' {server_uri}/{db_name}"

    logger.info("Executing cmd" + mongo_cmd)

    # Execute the command and capture its output
    process = subprocess.Popen(mongo_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Stream the output to the client as it becomes available
    bytes_read = 0
    while True:
        output = process.stdout.readline()
        if output == b'' and process.poll() is not None:
            break
        if output:
            bytes_read += len(output)
            yield output.decode().strip() + '\n'

    # Wait for the process to exit and get its return code
    return_code = process.wait()

    # If the process failed, raise an exception
    if return_code != 0:
        error_output = process.stderr.read().decode().strip()
        raise Exception(f"Query execution failed with return code {return_code}: {error_output}")

    logger.info(f"Query generated {bytes_read} bytes of output")