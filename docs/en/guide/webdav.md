# WebDAV Configuration

CloudPaste provides complete WebDAV protocol support, allowing you to mount file storage as a network drive for seamless file management experience.

## WebDAV Introduction

WebDAV (Web Distributed Authoring and Versioning) is an extension of the HTTP protocol that allows users to read and write files over the network.

### Main Features

- 📁 **File Management**: Create, delete, rename files and folders
- 🔄 **Sync Access**: File synchronization between multiple devices
- 🌐 **Cross-platform**: Supports Windows, macOS, Linux
- 🔒 **Secure Access**: Secure transmission based on HTTPS
- 📱 **Mobile Support**: Supports mobile device clients

## Access Address

CloudPaste WebDAV service address format:

Use backend domain as address!!!

```
https://your-domain.com/dav
```

Examples:

- `https://paste.example.com/dav`
- `https://cloudpaste-backend.your-username.workers.dev/dav`

## Authentication Methods

### 1. Administrator Account Authentication

Use CloudPaste administrator account:

- **Username**: `admin` (or your set administrator username)
- **Password**: Administrator password

### 2. API Key Authentication

Use dedicated API key, need to enable file and mount permissions:

- **Username**: API key value
- **Password**: API key value (same as user password)

::: tip Recommendation
It is recommended to create dedicated API keys for WebDAV access and set appropriate permission scopes.
:::

## Common Problem Solutions:

1. **Connection Issues**:

   - If 405 error occurs, confirm WebDAV URL format is correct (use backend domain as address)
   - Verify authentication credentials are valid
   - Check if API key has mount permissions

2. **Permission Errors**:

   - Confirm account has required permissions
   - Administrator account should have full permissions
   - API key needs to specifically enable mount permissions

3. **⚠️⚠️ WebDAV Upload Issues**:

   - For worker transfers, regarding Cloudflare Worker's upload limit (around 100MB), it is recommended to use direct upload mode and avoid using chunking.
   - For Docker deployment, only need to pay attention to nginx proxy configuration, upload mode is arbitrary.
   - Windows, RaiDrive and other client mounts do not currently support drag upload

## Next Steps

- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
- [Configure S3 Storage](/en/guide/s3-config)
- [GitHub Actions Deployment](/en/guide/deploy-github-actions)
