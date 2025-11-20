# GitHub Actions Auto-Deployment

GitHub Actions is the most recommended deployment method, enabling automatic deployment upon code push—completely free and highly efficient.

## Deployment Advantages

- ✅ **Completely Free**: Utilizes Cloudflare and GitHub’s free tiers
- ✅ **Automated**: Deploys automatically upon code push
- ✅ **Global Acceleration**: Cloudflare CDN with global nodes
- ✅ **High Availability**: 99.9% service uptime
- ✅ **HTTPS**: Automatic HTTPS certificates

## Prerequisites

### 1. Obtain Cloudflare API Information

#### API Token

1. Visit the [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Create a new API token
3. Select the "Edit Cloudflare Workers" template and `add D1 database edit permissions` (D1 is not included by default and must be added manually)

![cf-worker-api-token](/images/guide/cf-worker.png)

![D1](/images/guide/D1.png)

#### Account ID

Your Account ID can be found in the right sidebar of the Cloudflare dashboard.

### 2. Fork the Repository

Visit the [CloudPaste repository](https://github.com/ling-drag0n/CloudPaste) and click the **Fork** button.

## Configuration Steps

### 1. Configure GitHub Secrets

In your forked repository, go to `Settings` → `Secrets and variables` → `Actions` and add the following secrets:

| Secret Name               | Required | Description                                          |  
| ------------------------- | -------- |------------------------------------------------------|  
| `CLOUDFLARE_API_TOKEN`    | ✅       | Cloudflare API token                                 |  
| `CLOUDFLARE_ACCOUNT_ID`   | ✅       | Cloudflare Account ID                                |  
| `ENCRYPTION_SECRET`       | ❌       | Encryption key (optional, auto-generated，Be sure to remember your own settings) |  

### 2. Run Backend Deployment Workflow

1. Go to the `Actions` tab
2. Select the **Deploy Backend** workflow
3. Click **Run workflow**
4. Wait for deployment to complete

The workflow will automatically:

- Create a D1 database
- Initialize the database schema
- Deploy the Worker to Cloudflare
- Set environment variables

### 3. Configure a Custom Domain (Recommended)

To ensure accessibility in China, configure a custom domain:

1. Find your Worker in the Cloudflare Workers dashboard
2. Click **Settings**
3. Under **Domains & Routes**, add a custom domain
4. Note the `backend domain`—it will be needed for frontend configuration

> **Tips**: A custom domain is required for the backend because the default `*.workers.dev` domain is blocked in China. The frontend will call backend APIs using this domain, so remember it.

### 4. Run Frontend Deployment Workflow

1. Select the **Deploy Frontend** workflow
2. Click **Run workflow**
3. Wait for deployment to complete

### 5. Configure Frontend Environment Variables

After frontend deployment, configure the backend API URL:

1. Go to the Cloudflare Pages dashboard
2. Find your project (usually named `cloudpaste-frontend`)
3. Navigate to `Settings` → `Environment variables`
4. Add the variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: Your backend Worker URL (e.g., `https://cloudpaste-backend.your-username.workers.dev`)

![page1](/images/guide/test-1.png)

::: warning **Important**  
The environment variable must be a full URL with `https://` and no trailing `/`.  
:::

### 6. Redeploy the Frontend

After configuring the environment variable, rerun the frontend workflow to apply changes.

## Verify Deployment

### 1. Check Backend Service

Access your backend URL—you should see an API response:

```bash  
curl https://your-backend-url.workers.dev/api/health  
```  

### 2. Check Frontend Service

Visit your frontend URL—the CloudPaste interface should appear.

### 3. Test Functionality

1. Log in with the default admin credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
2. Create a test text entry
3. Upload a test file

::: warning **File Upload Configuration**  
If you need file upload functionality, configure S3 storage and CORS settings first—otherwise, uploads will fail.

**👉 [Configure S3 Storage Now](/guide/s3-config)**

Key Notes:

- Cloudflare R2 requires CORS rules
- Other S3 services also need CORS configuration
- File uploads will only work after configuration  
  :::

## Common Issues

### Deployment Failure

**Issue**: GitHub Actions workflow fails  
**Solution**:

1. Verify API token permissions
2. Confirm Account ID is correct
3. Check workflow logs for detailed errors

### Frontend Cannot Connect to Backend

**Issue**: Frontend shows network errors  
**Solution**:

1. Ensure the backend URL is correct
2. Check if the backend is running
3. Verify environment variable configuration

### Accessibility Issues in China

**Issue**: `.workers.dev` domains are inaccessible in China  
**Solution**:

1. Use a custom domain
2. Deploy via a China-friendly CDN
3. Consider Docker deployment

## Auto-Updates

After setup, services will auto-update upon pushing to the `main` branch:

- Changes in `backend/` trigger backend deployment
- Changes in `frontend/` trigger frontend deployment

## Next Steps

- [Configure S3 Storage](/guide/s3-config)
- [Set Up WebDAV](/guide/webdav)
- [View API Docs](/api/)
- [Read Development Guide](/development/)