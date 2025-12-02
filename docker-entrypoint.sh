#!/bin/sh

echo "Current directory contents:"
ls -la

echo "Dist directory contents:"
ls -la dist/

echo "Dist/src directory contents:"
ls -la dist/src/

echo "Waiting for database to be ready..."
./wait-for-it.sh $POSTGRES_HOST:$POSTGRES_PORT -t 30

echo "Starting the application..."
NODE_ENV=development NODE_PATH=/app node dist/src/main.js 