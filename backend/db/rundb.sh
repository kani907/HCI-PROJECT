#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="mongodb_local"

echo "--- Cleaning up old container ---"
docker rm -f "$CONTAINER_NAME" || true

echo "--- Building image ---"
docker build -t appdb .

echo "--- Starting container: $CONTAINER_NAME ---"
docker run -d -p 27017:27017 --name "$CONTAINER_NAME" appdb

echo "--- Waiting for MongoDB to be ready ---"
until docker logs "$CONTAINER_NAME" 2>&1 | grep -q "Waiting for connections"; do
    echo "Waiting... (container logs not yet showing ready state)"
    sleep 1
    
    if ! docker ps -q -f name="$CONTAINER_NAME"; then
        echo "Error: Container $CONTAINER_NAME crashed during startup."
        docker logs "$CONTAINER_NAME"
        exit 1
    fi
done

echo "--- MongoDB is ready! ---"
docker ps -f name="$CONTAINER_NAME"