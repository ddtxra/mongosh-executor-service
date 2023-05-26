# Use the official MongoDB image as the base image
FROM mongo:latest

# Copy the JavaScript script to the docker container
COPY init-db.js /docker-entrypoint-initdb.d/

# Set environment variables
ENV MONGO_INITDB_DATABASE=demo

# Expose the default MongoDB port
EXPOSE 27017