FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

# Install required packages
RUN pip install pymongo requests

# Copy the source code into the container
COPY ./app /app

# Set environment variables
ENV KEYCLOAK_URL "http://your-keycloak-url/auth/realms/your-realm"
ENV CLIENT_ID "your-client-id"
ENV CLIENT_SECRET "your-client-secret"

# Expose the port that the container will run on
EXPOSE 80

# Start the application using Uvicorn ASGI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]