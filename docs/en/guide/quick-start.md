# Quick Start

This guide will help you quickly deploy and use CloudPaste.

## Prerequisites

::: tip Choose Deployment Method
Choose the appropriate deployment method based on your needs:

- **[GitHub Actions Deploy](/en/guide/deploy-github-actions)** - Recommended, completely free and automated
- **[Docker Deploy](/en/guide/deploy-docker)** - Suitable for users with servers, supports local storage
- **[More Deploy Methods](/en/guide/deploy-manual)** - Includes manual deployment methods for Cloudflare, Vercel and other platforms
  :::

Before starting deployment, please ensure you have prepared the following:

- [x] [Cloudflare](https://dash.cloudflare.com) account / VPS (docker)
- [x] If using R2: Enable **Cloudflare R2** service and create bucket (payment method required)
- [x] If using B2: Register [Backblaze](https://www.backblaze.com) account and create application key
- [x] If using Vercel: Register [Vercel](https://vercel.com) account
- [x] Other S3 storage service configuration:
  - `S3_ACCESS_KEY_ID`
  - `S3_SECRET_ACCESS_KEY`
  - `S3_BUCKET_NAME`
  - `S3_ENDPOINT`

## Initial Configuration

After deployment, follow these steps for initial configuration:

### 1. Access Admin Interface

Login with default admin account:

- **Username**: `admin`
- **Password**: `admin123`

::: warning Security Notice
Please change the default admin password immediately after system initialization!
:::

### 2. Configure Storage Service

Configure your S3 storage service in the admin interface:

1. Go to "S3 Storage Configuration"
2. Click "Add Storage Configuration"
3. Fill in storage service information
4. Test connection and save

### 3. Create API Key (Optional)

If you need to use API or WebDAV features:

1. Go to "API Key Management"
2. Create new API key
3. Set appropriate permissions
4. Save key information

## Basic Usage

### Text Sharing

1. Click "Create Text" on homepage
2. Write content using Markdown editor
3. Set access permissions (optional)
4. Click "Save and Share"

### File Upload

1. Click "Upload File" on homepage
2. Select or drag files
3. Set file properties (optional)
4. Start upload

### WebDAV Mount

1. Get WebDAV address: `https://your-domain/dav`
2. Authenticate with admin account or API key
3. Add network location in file manager

## Next Steps

- Learn more about [Features](/en/guide/features)
- Check detailed deployment guides:
  - [GitHub Actions Deploy](/en/guide/deploy-github-actions)
  - [Docker Deploy](/en/guide/deploy-docker)
  - [Manual Deploy](/en/guide/deploy-manual)
- Read [API Documentation](/en/api/)
- Participate in [Development](/en/development/)
