# GitHub Actions Auto Deploy

GitHub Actions is the most recommended deployment method, enabling automatic deployment after code push, completely free and efficient.

## Deployment Advantages

- ✅ **Completely Free**: Utilizes Cloudflare and GitHub free tiers
- ✅ **Automated**: Automatic deployment on code push
- ✅ **Global Acceleration**: Cloudflare CDN global nodes
- ✅ **High Availability**: 99.9% service availability
- ✅ **HTTPS**: Automatic HTTPS certificates

## Prerequisites

### 1. Get Cloudflare API Information

#### API Token

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Create new API token
3. Select "Edit Cloudflare Workers" template and add D1 database edit permissions

   ![D1](/images/guide/D1.png)

#### Account ID

You can find your Account ID in the right sidebar of the Cloudflare dashboard.

### 2. Fork Project Repository

Visit [CloudPaste Repository](https://github.com/ling-drag0n/CloudPaste) and click the Fork button.

## Configuration Steps

### 1. Configure GitHub Secrets

In your forked repository, go to `Settings` → `Secrets and variables` → `Actions`, add the following Secrets:

| Secret Name             | Required | Description                                               |
| ----------------------- | -------- | --------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | ✅       | Cloudflare API token                                      |
| `CLOUDFLARE_ACCOUNT_ID` | ✅       | Cloudflare Account ID                                     |
| `ENCRYPTION_SECRET`     | ❌       | Encryption key (optional, auto-generated if not provided) |

### 2. Run Backend Deployment Workflow

1. Go to the `Actions` tab
2. Select "Deploy Backend" workflow
3. Click "Run workflow"
4. Wait for deployment to complete

The workflow will automatically:

- Create D1 database
- Initialize database structure
- Deploy Worker to Cloudflare
- Set environment variables

### 3. Configure Custom Domain (Recommended)

For normal access in China, it's recommended to configure a custom domain:

1. Find your Worker in the Cloudflare Workers console
2. Click "Settings" → "Triggers"
3. Add custom domain
4. Record the backend domain for frontend configuration

### 4. Run Frontend Deployment Workflow

1. Select "Deploy Frontend" workflow
2. Click "Run workflow"
3. Wait for deployment to complete

### 5. Configure Frontend Environment Variables

After frontend deployment, configure the backend API address:

1. Go to Cloudflare Pages console
2. Find your project (usually named `cloudpaste-frontend`)
3. Go to `Settings` → `Environment variables`
4. Add environment variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: Your backend Worker URL (e.g., `https://cloudpaste-backend.your-username.workers.dev`)

![page1](/images/guide/test-1.png)

::: warning Important Note
The environment variable value must be a complete URL, including the `https://` prefix, without a trailing `/`
:::

### 6. Redeploy Frontend

After configuring environment variables, rerun the frontend workflow to apply the configuration.

## Verify Deployment

### 1. Check Backend Service

Visit your backend URL, you should see API response:

```bash
curl https://your-backend-url.workers.dev/api/health
```

### 2. Check Frontend Service

Visit your frontend URL, you should see the CloudPaste interface.

### 3. Test Functionality

1. Login with default admin account:
   - Username: `admin`
   - Password: `admin123`
2. Create test text
3. Upload test file

## Common Issues

### Deployment Failure

**Problem**: GitHub Actions workflow fails
**Solution**:

1. Check if API Token permissions are correct
2. Confirm Account ID is correct
3. Check workflow logs for detailed error information

### Frontend Cannot Connect to Backend

**Problem**: Frontend shows network error
**Solution**:

1. Confirm backend URL configuration is correct
2. Check if backend service is running normally
3. Confirm environment variables are configured correctly

### China Access Issues

**Problem**: Cannot access `.workers.dev` domain in China
**Solution**:

1. Configure custom domain
2. Use domestic CDN service
3. Consider using Docker deployment

## Automatic Updates

After configuration, services will automatically update when code is pushed to the `main` branch:

- Modifying files in the `backend/` directory will trigger backend deployment
- Modifying files in the `frontend/` directory will trigger frontend deployment

## Next Steps

- [Configure S3 Storage](/en/guide/s3-config)
- [Setup WebDAV](/en/guide/webdav)
- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
