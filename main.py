import subprocess
from fastapi import FastAPI
import logging
from datetime import datetime
from fastapi.responses import StreamingResponse

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

db_uri = "mongodb+srv://danit:1234567890@cluster0.c8hfq.mongodb.net/sample_airbnb"

@app.get("/execute-query")
def execute_mongo_query(script: str):

    print("Current Time =", datetime.now().strftime("%H:%M:%S"))

    # Build the command to execute
    mongo_cmd = f"mongosh --quiet --norc " + db_uri + " queries/" + script + ".js execute-query.js"

    logger.info("Executing cmd" + mongo_cmd)

    process = subprocess.Popen(mongo_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    async def stream_response():
        while True:
            line = process.stdout.readline().decode().strip()
            if not line:
                break
            yield line.encode()

    return StreamingResponse(stream_response(), media_type="application/json")
