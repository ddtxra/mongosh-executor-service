import subprocess
from fastapi import FastAPI, Response, HTTPException
import logging
import json
import asyncio
from datetime import datetime
from fastapi.responses import StreamingResponse

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

db_uri = "mongodb://mongo:27017/demo"

@app.get("/execute-query")
async def execute_mongo_query(script: str):
    print("Current Time =", datetime.now().strftime("%H:%M:%S"))

    # Build the command to execute
    mongo_cmd = f"mongosh --quiet --norc " + db_uri + " queries/" + script + ".js execute-query.js"

    logger.info("Executing cmd" + mongo_cmd)

    process = subprocess.Popen(mongo_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    async def stream_response():
        while True:
            lineerr = process.stderr.readline()
            if lineerr:
                error_msg = lineerr.decode().strip()
                error_obj = {"errorMsg": error_msg}
                raise HTTPException(status_code=422, detail=json.dumps(error_obj))

            line = process.stdout.readline().decode().strip()
            if not line:
                break
            yield line.encode()

    return StreamingResponse(stream_response(), media_type="application/json")
