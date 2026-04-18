# VaultVision Deployment Script for Google Cloud Platform
$PROJECT_ID = gcloud config get-value project
$REGION = "us-central1"

Write-Host "Deploying VaultVision to GCP Project: $PROJECT_ID..." -ForegroundColor Cyan

# Step 1: Initialize Artifact Registry
Write-Host "Initializing Artifact Registry..." -ForegroundColor Yellow
gcloud artifacts repositories create vaultvision-repo --repository-format=docker --location=$REGION --description="Docker repository for VaultVision" 2>$null
if ($?) { Write-Host "Repository checked/created." -ForegroundColor Green } else { Write-Host "Repository might already exist, continuing..." -ForegroundColor Green }

# Step 2: Build Images
Write-Host "Building Backend Image..." -ForegroundColor Yellow
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/backend" ./backend

Write-Host "Building Frontend Image..." -ForegroundColor Yellow
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/frontend" ./frontend

# Step 3: Deploy Backend
Write-Host "Deploying Backend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy vaultvision-backend `
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/backend" `
  --region $REGION `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 1 `
  --format="value(status.url)" | Out-File -FilePath backend_url.txt -Encoding utf8

$BACKEND_URL = (Get-Content backend_url.txt).Trim()
Write-Host "Backend deployed at: $BACKEND_URL" -ForegroundColor Green

# Step 4: Deploy Frontend
Write-Host "Deploying Frontend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy vaultvision-frontend `
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/vaultvision-repo/frontend" `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars NEXT_PUBLIC_API_URL=$BACKEND_URL `
  --format="value(status.url)" | Out-File -FilePath frontend_url.txt -Encoding utf8

$FRONTEND_URL = (Get-Content frontend_url.txt).Trim()
Write-Host "Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green

Write-Host "Deployment Complete! 🚀" -ForegroundColor Cyan
Write-Host "VaultVision Dashboard: $FRONTEND_URL" -ForegroundColor Cyan
