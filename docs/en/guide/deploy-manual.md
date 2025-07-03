# More Deployment Options

Suitable for users with some technical background, providing complete control and flexibility.

## Deployment Advantages

- ✅ **Complete Control**: Full control over the deployment process
- ✅ **Deep Customization**: Deep customization of configurations
- ✅ **Multi-platform Support**: Support for multiple deployment platforms

## Supported Platforms

### Cloudflare Platform

- **Workers**: Backend API service
- **Pages**: Frontend static website
- **D1**: SQLite database
- **R2**: Object storage (optional)

### Other Platforms

- **Vercel**: Frontend Deployment
- **Netlify**: Frontend Deployment
- **EdgeOne**: Frontend Deployment
- **HuggingFace**: Docker Deployment
- **ClawCloud**: Docker Deployment

## Prerequisites

### Required Tools

```bash
# Install Node.js (version 18+)
node --version

# Install Wrangler CLI
npm install -g wrangler

# Verify installation
wrangler --version
```

### Get Source Code

```bash
# Clone repository
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste

# Install dependencies
cd backend && npm install
cd frontend && npm install
```

## Cloudflare Manual Deployment

### 1. Configure Wrangler

```bash
# Login to Cloudflare
wrangler auth login

# Verify login status
wrangler whoami
```

### 2. Create D1 Database

```bash
# Create database
wrangler d1 create cloudpaste-db

# Record database ID for later configuration
```

### 3. Configure Backend

Edit `backend/wrangler.toml`:

```toml
name = "cloudpaste-backend"
main = "worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cloudpaste-db"
database_id = "your-database-id"  # Replace with actual database ID

[vars]
NODE_ENV = "production"
ENCRYPTION_SECRET = "your-encryption-secret"  # Replace with your encryption key
```

### 4. Initialize Database

```bash
cd backend

# Execute database migration
wrangler d1 execute cloudpaste-db --file=./schema.sql
```

### 5. Deploy Backend

```bash
# Deploy Worker
wrangler deploy

# Record Worker URL for frontend configuration
```

### 6. Configure Frontend

Edit `frontend/.env.production`:

```bash
VITE_BACKEND_URL=https://your-worker-url.workers.dev
VITE_APP_ENV=production
```

### 7. Build Frontend

```bash
cd frontend

# Build production version
npm run build
```

### 8. Deploy Frontend to Cloudflare Pages

```bash
# Create Pages project
wrangler pages project create cloudpaste-frontend

# Deploy to Pages
wrangler pages deploy dist --project-name=cloudpaste-frontend
```

## Vercel Deployment

### Frontend Deployment to Vercel

1. **Connect GitHub Repository**

   - Login to [Vercel](https://vercel.com)
   - Click "New Project"
   - Select CloudPaste repository

2. **Configure Build Settings**

   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Configure Environment Variables**

   ```
   VITE_BACKEND_URL=https://your-backend-url
   ```

4. **Deploy**
   - Click "Deploy" to start deployment
   - Wait for build completion

### Backend Deployment to Cloudflare Workers

Backend is still recommended to deploy to Cloudflare Workers, follow the above Cloudflare deployment steps.

## Custom Domain Configuration

### Cloudflare Workers Custom Domain

1. Select your Worker in Cloudflare Workers console
2. Go to "Settings" → "Triggers"
3. Click "Add Custom Domain"
4. Enter your domain and save

### Cloudflare Pages Custom Domain

1. Select your project in Cloudflare Pages console
2. Go to "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain and follow the instructions

## Next Steps

- [Configure S3 Storage](/en/guide/s3-config)
- [Setup WebDAV](/en/guide/webdav)
- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
