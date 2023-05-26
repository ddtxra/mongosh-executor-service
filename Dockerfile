# Use the official Python base image
FROM --platform=linux/amd64 python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y curl gnupg

# Copy the project files to the working directory
COPY requirements.txt .
COPY execute-query.js .

COPY queries ./queries

# Install project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download and install the latest version of the mongosh binary
RUN apt-get update && apt-get install -y curl && \
    curl -O https://downloads.mongodb.com/compass/mongosh-1.9.0-linux-x64.tgz && \
    tar -xf mongosh-1.9.0-linux-x64.tgz && \
    mv mongosh*/bin/mongosh /usr/local/bin && \
    rm -rf mongosh*


# Install Gunicorn
RUN pip install gunicorn

COPY main.py .

# Expose the port on which the FastAPI server will run
EXPOSE 8000

# Command to start the FastAPI server
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]