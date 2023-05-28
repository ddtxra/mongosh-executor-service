# Use the official Python base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y curl gnupg libc6

# Copy the project files to the working directory
COPY requirements.txt .

# Install project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Detect the host architecture and select the appropriate MongoDB Shell binary
RUN if [ "$(uname -m)" = "x86_64" ]; then \
        curl -O https://downloads.mongodb.com/compass/mongosh-1.9.0-linux-x64.tgz; \
    else \
        curl -O https://downloads.mongodb.com/compass/mongosh-1.9.0-linux-arm64.tgz; \
    fi && \
    tar -xf mongosh-1.9.0-linux-*.tgz && \
    mv mongosh*/bin/mongosh /usr/local/bin && \
    rm -rf mongosh*

# Install Gunicorn
RUN pip install gunicorn

COPY main.py .

# Expose the port on which the FastAPI server will run
EXPOSE 8000

# Command to start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]