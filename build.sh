#!/bin/bash

TAG=${1:-latest} 

# Load .env file
export $(grep -v '^#' .env.production | xargs)

# Build and push multi-arch image with both tags
docker buildx build \
  --platform linux/arm64,linux/amd64 \
  --build-arg VITE_LIFF_ID=$VITE_LIFF_ID \
  --build-arg VITE_LIFF_ID_2=$VITE_LIFF_ID_2 \
  --build-arg VITE_LIFF_ID_ACHIEVEMENT=$VITE_LIFF_ID_ACHIEVEMENT \
  --build-arg BASE_URL=$BASE_URL \
  --build-arg VITE_API_URL=$VITE_API_URL \
  -t apichayauwu/wpd-liff:$TAG \
  -t apichayauwu/wpd-liff:latest \
  --push .
