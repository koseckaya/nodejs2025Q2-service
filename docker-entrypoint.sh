#!/bin/sh

echo "Current directory contents:"
ls -la

echo "Dist directory contents:"
ls -la dist/

echo "Dist/src directory contents:"
ls -la dist/src/

echo "Waiting for database to be ready..."
./wait-for-it.sh $POSTGRES_HOST:$POSTGRES_PORT -- echo "Database is up"


echo "Starting the application..."
npm run start:dev