import subprocess
from fastapi import FastAPI
import logging
from datetime import datetime
from fastapi.responses import StreamingResponse

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.INFO)

app = FastAPI()

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


db_uri = "mongodb+srv://danit:1234567890@cluster0.c8hfq.mongodb.net/sample_airbnb"
# should be a pool of connection
mongosh = subprocess.Popen(['mongosh --quiet --norc ' + db_uri], shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

@app.get("/execute-query-from-pool")
async def run_query(script: str):
    print("Boum")
    # Write user query to mongosh process stdin
    # open text file in read mode"
    text_file = open("queries/" + script + ".js", "r")
    data = text_file.read().replace("\n", " ").replace("\r", "")
    text_file.close()

    execute_file = open("execute-query.js", "r")
    data_e = execute_file.read().replace("\n", " ").replace("\r", "") + "\n"
    data = data + data_e

    print(data)
    execute_file.close()

    mongosh.stdin.write(data.encode())
    mongosh.stdin.flush()

    async def stream_response():
        while True:
            line = mongosh.stdout.readline().decode().strip()
            if not line:
                break
            yield line.encode()

    return StreamingResponse(stream_response(), media_type="application/json")
