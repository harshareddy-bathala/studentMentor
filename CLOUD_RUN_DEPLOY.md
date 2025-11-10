# 🚀 Google Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud Account** - https://console.cloud.google.com/
2. **Google Cloud SDK** - Install from https://cloud.google.com/sdk/docs/install
3. **Docker** (optional for local testing)

## Quick Deployment Steps

### 1. Set up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create student-mentor-ai --name="Student Mentor AI"

# Set the project
gcloud config set project student-mentor-ai

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Configure Environment Variables

Create a `.env.production` file (this stays local):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** We'll set this as a Cloud Run secret during deployment.

### 3. Build and Deploy to Cloud Run

#### Option A: Direct Deployment (Recommended)

```bash
# Deploy directly from source
gcloud run deploy student-mentor-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE"
```

#### Option B: Build then Deploy

```bash
# Build the container image
gcloud builds submit --tag gcr.io/student-mentor-ai/student-mentor-ai

# Deploy to Cloud Run
gcloud run deploy student-mentor-ai \
  --image gcr.io/student-mentor-ai/student-mentor-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE"
```

### 4. Set Environment Variables Securely (Better Approach)

```bash
# Create a secret
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-

# Deploy with secret
gcloud run deploy student-mentor-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --update-secrets=VITE_GEMINI_API_KEY=gemini-api-key:latest
```

### 5. Access Your Deployment

After deployment completes, you'll get a URL like:
```
https://student-mentor-ai-XXXXX-uc.a.run.app
```

## Local Docker Testing (Optional)

```bash
# Build the Docker image locally
docker build -t student-mentor-ai .

# Run locally
docker run -p 8080:8080 student-mentor-ai

# Open http://localhost:8080
```

## Configuration Options

### Custom Domain

```bash
# Map a custom domain
gcloud run services update student-mentor-ai \
  --platform managed \
  --region us-central1
```

Then follow the instructions to verify domain ownership.

### Scaling Configuration

```bash
# Set min/max instances
gcloud run deploy student-mentor-ai \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=80
```

### Memory and CPU

```bash
# Allocate resources
gcloud run deploy student-mentor-ai \
  --memory=512Mi \
  --cpu=1
```

## Deployment Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled (Cloud Build, Cloud Run)
- [ ] Gemini API key ready
- [ ] Source code builds successfully (`npm run build`)
- [ ] Docker image builds (if testing locally)
- [ ] Environment variables configured
- [ ] Deploy command executed
- [ ] Deployment URL accessible
- [ ] App works correctly (login, chat, dashboard)
- [ ] Update README with live demo URL

## Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds log [BUILD_ID]

# Test build locally
npm run build
```

### Container Fails to Start

```bash
# View logs
gcloud run logs read student-mentor-ai --region us-central1

# Check container locally
docker build -t test . && docker run -p 8080:8080 test
```

### Environment Variable Issues

```bash
# List current env vars
gcloud run services describe student-mentor-ai --region us-central1

# Update env vars
gcloud run services update student-mentor-ai \
  --update-env-vars="VITE_GEMINI_API_KEY=NEW_KEY"
```

## Cost Optimization

Cloud Run pricing is based on:
- Request count
- CPU and memory usage
- Network egress

**Free Tier:**
- 2 million requests/month
- 360,000 GB-seconds/month
- 180,000 vCPU-seconds/month

For a hackathon demo with moderate traffic, this should be **free or very low cost** (~$1-5/month).

## Update Deployment

```bash
# Redeploy after changes
gcloud run deploy student-mentor-ai \
  --source . \
  --platform managed \
  --region us-central1
```

## Architecture

```
┌─────────────────┐
│   Users/Judges  │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────┐
│   Cloud Run         │
│  ┌───────────────┐  │
│  │ Nginx Server  │  │
│  │  (Port 8080)  │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │  Static SPA   │  │
│  │  (React App)  │  │
│  └───────────────┘  │
└─────────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────────┐
│  Gemini 2.0 Flash   │
│     (External)      │
└─────────────────────┘
```

## Important Notes

1. **API Key Security**: Never commit API keys to git. Use Cloud Run secrets.
2. **Build Time**: First deployment takes 3-5 minutes.
3. **Cold Starts**: First request after idle period may take 1-2 seconds.
4. **Region**: Choose `us-central1` for best performance with Gemini API.
5. **Logs**: Check Cloud Run logs for debugging issues.

## Demo URL for Hackathon

After deployment, update your hackathon submission with:
- Live Demo URL: `https://student-mentor-ai-xxxxx.a.run.app`
- Source Code: `https://github.com/harshareddy-bathala/studentMentor`

---

**Need help?** Check Cloud Run documentation: https://cloud.google.com/run/docs
