import multiprocessing
import subprocess
from fastapi import FastAPI, HTTPException
import logging
from datetime import datetime
from fastapi.responses import StreamingResponse
import json

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

# should be a pool of connection
mongosh = subprocess.Popen(['mongosh --quiet --norc localhost/crypto'], shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

@app.get("/query2")
async def run_query():
    # Write user query to mongosh process stdin
    # open text file in read mode
    text_file = open("query.js", "r")
    data = text_file.read().replace("\n", " ").replace("\r", "") + "\n"
    text_file.close()

    print("Reseting")

    mongosh.stdin.write(b'reset()\n')
    mongosh.stdin.flush()
    mongosh.stdout.readline()

    print("Done")

    mongosh.stdin.write(data.encode())
    mongosh.stdin.flush()

    async def stream_response():
        while True:
            line = mongosh.stdout.readline().decode().strip().replace("crypto>", "")
            if not line:
                break
            yield line.encode()

    return StreamingResponse(stream_response(), media_type="application/json")

    '''
    async def stream_response():
        while True:
            line = mongosh.stdout.readline().decode().strip()
            if not line:
                break
            obj = json.loads(line.replace("crypto>", ""))
            yield obj

    return StreamingResponse(stream_response(), media_type="application/json")
    '''


@app.get("/query")
def execute_mongo_query():
    logger.info("this will get printed")

    print("Current Time =", datetime.now().strftime("%H:%M:%S"))

    # Build the command to execute
    server_uri = "localhost"
    db_name = "crypto"
    mongo_cmd = f"mongosh --quiet --norc {server_uri}/{db_name} query.js"

    logger.info("Executing cmd" + mongo_cmd)

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
