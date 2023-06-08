import subprocess
import os
from fastapi import FastAPI, HTTPException, Request
import logging
from datetime import datetime
from fastapi.responses import StreamingResponse
import asyncio

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

db_uri = "mongodb://mongo:27017/demo"

@app.get("/view/{script}")
async def execute_mongo_query_get(script: str, request: Request):
    return await execute_mongo_query(script, request, request.query_params)

@app.post("/view/{script}")
async def execute_mongo_query_post(script: str, request: Request):
    return await execute_mongo_query(script, request, await request.json())

async def execute_mongo_query(script: str, request: Request, params):
    print("Current Time =", datetime.now().strftime("%H:%M:%S"))
    query_params = dict(params)

    print("params: " + str(query_params))

    directory = "tmp"  # Replace with the desired directory path

    if not os.path.exists(directory):
        os.makedirs(directory)

    # Generate a random name for the file with .js extension
    file_name = directory + "/tmp_" + str(datetime.now().strftime("%y%m%d%H%M%S.%f")) + ".js"

    # Accessing other parameters dynamically

    # Create the file with the random name
    with open(file_name, "w") as file:
        if len(query_params) > 0:
            file.write("var parameters = JSON.parse(\'" + str(query_params).replace("\'", "\"") + "\');\n")
        else:
            # Handle the case when match is not set
            file.write("var parameters = {};\n")  # Write an empty JSON object

    # Build the command to execute
    mongo_cmd = f"mongosh --quiet --norc " + db_uri + " queries/" + script + ".js  " + file_name + " execute-query.js"

    logger.info("Executing cmd: " + mongo_cmd)

    try:
        process = await asyncio.create_subprocess_shell(
            mongo_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )


    except:
        logger.error("EXCEPTION: process failed")

    async def stream_response():
        while True:
            line = await process.stdout.readline()
            if not line:
                break
            yield line

    async def capture_errors():
        while True:
            lineerr = await process.stderr.readline()
            if not lineerr:
                break
            yield lineerr

    def delete_temp_file(f):
        try:
            os.remove(f)
            logger.info("Temporary file deleted: " + f)
        except OSError as e:
            logger.error("Error deleting temporary file: " + f)
            logger.error(e)

    # Start capturing errors in the background
    error_msgs = []

    try:
        return StreamingResponse(stream_response(), media_type="application/json")
    except:
        logger.error("EXCEPTION: error occurred while streaming response")
        process.terminate()
    #finally:
        #delete_temp_file(file_name)

    # Check for error messages from stderr
    async for lineerr in capture_errors():
        error_msgs.append(lineerr.decode().strip())

    # If there are any error messages, raise HTTPException
    if error_msgs:
        error_msg = {"errors": error_msgs}
        raise HTTPException(status_code=422, detail=error_msg)
