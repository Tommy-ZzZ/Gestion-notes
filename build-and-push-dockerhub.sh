#!/bin/bash

DOCKERHUB_USER="alfa2003"

echo "🔨 Building Backend..."
docker build -t ${DOCKERHUB_USER}/notes-backend:latest ./notes-backend

echo "🔨 Building Frontend..."
docker build -t ${DOCKERHUB_USER}/notes-frontend:latest \
  --build-arg VITE_API_URL=/api \
  --build-arg VITE_RECAPTCHA_SITE_KEY=6Ld62hYsAAAAADpYWTXb4yIogQpwZtv7WbUiWiYr \
  ./notes-frontend

echo "📤 Pushing to Docker Hub..."
docker push ${DOCKERHUB_USER}/notes-backend:latest
docker push ${DOCKERHUB_USER}/notes-frontend:latest

echo "✅ Done!"