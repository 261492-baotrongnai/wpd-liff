#!/bin/bash

# Load .env file
export $(grep -v '^#' .env.production | xargs)

# Build Docker image
docker buildx build \
  --platform linux/arm64,linux/amd64 \
  --build-arg VITE_LIFF_ID=$VITE_LIFF_ID \
  --build-arg VITE_LIFF_ID_2=$VITE_LIFF_ID_2 \
  --build-arg BASE_URL=$BASE_URL \
  --build-arg VITE_API_URL=$VITE_API_URL \
  --build-arg VITE_SECRET=$VITE_SECRET \
  -t apichayauwu/wpd-liff:1.4 --push .