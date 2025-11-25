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

## Deployment Architecture Selection

CloudPaste offers two manual deployment architectures to choose from:

### 🔄 Unified Deployment (Recommended)

**Frontend and backend deployed on the same Cloudflare Worker**

✨ **Advantages:**
- **Same Origin** - No CORS issues, simpler configuration
- **Lower Cost** - Navigation requests are free, saving 60%+ costs compared to separated deployment
- **Simpler Deployment** - Deploy frontend and backend in one go, no need to manage multiple services
- **Better Performance** - Frontend and backend on the same Worker, faster response time

### 🔀 Separated Deployment

**Backend deployed to Cloudflare Workers, frontend deployed to Cloudflare Pages**

✨ **Advantages:**
- **Flexible Management** - Independent deployment, no mutual interference
- **Team Collaboration** - Frontend and backend can be maintained by different teams
- **Scalability** - Frontend can easily switch to other platforms (e.g., Vercel)

---

## 🔄 Unified Manual Deployment (Recommended)

Unified deployment deploys both frontend and backend to the same Cloudflare Worker, offering simpler configuration and lower costs.

### Step 1: Clone Repository

```bash
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste
```

### Step 2: Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

**Verify build output:** Ensure `frontend/dist` directory exists and contains `index.html`

### Step 3: Configure Backend

```bash
cd backend
npm install
npx wrangler login
```

### Step 4: Create D1 Database

```bash
npx wrangler d1 create cloudpaste-db
```

Note the `database_id` from the output (e.g., `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 5: Initialize Database

```bash
npx wrangler d1 execute cloudpaste-db --file=./schema.sql
```

### Step 6: Configure wrangler.spa.toml

Edit `backend/wrangler.spa.toml` file and modify the database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "cloudpaste-db"
database_id = "YOUR_DATABASE_ID"  # Replace with ID from Step 4
```

### Step 7: Deploy to Cloudflare Workers

```bash
npx wrangler deploy --config wrangler.spa.toml
```

After successful deployment, you'll see your application URL:

```
Published cloudpaste-spa (X.XX sec)
  https://cloudpaste-spa.your-account.workers.dev
```

### Deployment Complete!

**Visit your application:** Open the URL above to use CloudPaste

**Post-deployment Configuration:**
1. The database will be automatically initialized on first visit
2. Log in with the default admin account (username: `admin`, password: `admin123`)
3. **⚠️ Change the default admin password immediately!**
4. Configure S3/WEBDAV-compatible storage service in the admin panel
5. (Optional) Bind a custom domain in Cloudflare Dashboard

::: warning Important Reminder: File Upload Configuration
If you need to use file upload functionality, please configure S3 storage service and CORS settings first.

**👉 [Configure S3 Storage Now](/en/guide/s3-config)**

Pay special attention to Cloudflare R2 CORS configuration, this is the step users most easily overlook!
:::

---

## 🔀 Separated Manual Deployment

If you need to deploy and manage frontend and backend independently, you can choose the separated deployment method.

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

::: warning Important Reminder: File Upload Configuration
After Cloudflare deployment is complete, if you need to use file upload functionality, please configure S3 storage service and CORS settings first.

**👉 [Configure S3 Storage Now](/en/guide/s3-config)**

Pay special attention to Cloudflare R2 CORS configuration, this is the step users most easily overlook!
:::

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

::: warning Important Reminder: File Upload Configuration
After Vercel frontend deployment is complete, if you need to use file upload functionality, please configure S3 storage service and CORS settings first.

**👉 [Configure S3 Storage Now](/en/guide/s3-config)**
:::

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
