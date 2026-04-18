#!/bin/bash
# VaultVision Deployment Script for Google Cloud Platform

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo "Deploying VaultVision to GCP Project: $PROJECT_ID..."

# Step 1: Initialize Artifact Registry and Build Images
gcloud artifacts repositories create vaultvision-repo --repository-format=docker --location=$REGION --description="Docker repository for VaultVision" || echo "Repository may already exist"

# Build Backend Image
echo "Building and pushing Backend..."
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/backend ./backend

# Build Frontend Image
echo "Building and pushing Frontend..."
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/frontend ./frontend

# Step 2: Deploy Backend to Cloud Run
echo "Deploying Backend to Cloud Run..."
BACKEND_URL=$(gcloud run deploy vaultvision-backend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/backend \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --format="value(status.url)")

echo "Backend deployed at: $BACKEND_URL"

# Step 3: Deploy Frontend to Cloud Run
echo "Deploying Frontend to Cloud Run..."
FRONTEND_URL=$(gcloud run deploy vaultvision-frontend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/frontend \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=$BACKEND_URL \
  --format="value(status.url)")

echo "Frontend deployed at: $FRONTEND_URL"

echo "Deployment Complete! 🚀"
echo "VaultVision Dashboard: $FRONTEND_URL"
