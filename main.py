import subprocess
import uuid
from typing import Optional
from fastapi import FastAPI, HTTPException
import logging
from datetime import datetime
from fastapi.responses import StreamingResponse
import asyncio
import json

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

db_uri = "mongodb://mongo:27017/demo"

@app.get("/execute-query")
async def execute_mongo_query(script: str, match: Optional[str] = None, limit: int = 1000):
    print("Current Time =", datetime.now().strftime("%H:%M:%S"))

    # Generate a random name for the file with .js extension
    file_name = str(uuid.uuid4()) + ".js"

    # Create the file with the random name
    with open(file_name, "w") as file:
        if match:
            file.write("var parameters = JSON.parse('" + match + "');\n")
            file.write("var limit = " + str(limit) + ";\n")
        else:
            # Handle the case when match is not set
            file.write("var parameters = {};\n")  # Write an empty JSON object
            file.write("var limit = " + str(limit) + ";\n")


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

    # Start capturing errors in the background
    error_msgs = []

    try:
        return StreamingResponse(stream_response(), media_type="application/json")
    except:
        logger.error("EXCEPTION: error occurred while streaming response")
        process.terminate()

    # Check for error messages from stderr
    async for lineerr in capture_errors():
        error_msgs.append(lineerr.decode().strip())

    # If there are any error messages, raise HTTPException
    if error_msgs:
        error_msg = {"errors": error_msgs}
        raise HTTPException(status_code=422, detail=error_msg)
