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

To use a dedicated API key, enable mount page permissions and WEBDAV permissions:

- **Username**: The value of the API key  
- **Password**: The value of the API key (same as the username)  

::: tip Recommendation  
It is recommended to create a dedicated API key for WebDAV access and set appropriate permission scopes.  
:::  

## Usage  

1. Before use, ensure that the S3 storage bucket is configured. If it is to be used by API key users, the "Allow API Key Users" permission for the corresponding bucket must be enabled.  
2. After configuring the S3 storage, add the corresponding driver in the mount management for mounting. The path here can be filled in any format as an identifier for the mount path and is unrelated to the driver content.  
3. After successful mounting, files can be accessed and managed in the WebDAV client using the format `https://your-domain.com/dav/mount-path/`. Here, the "mount-path/" corresponds to the root directory path under your S3 bucket. To specify a subfolder, use the corresponding folder path: `https://your-domain.com/dav/mount-path/subfolder-path-under-S3-root/`.  
4. For API key users, ensure that the mount permission and the "Allow API Key Users" permission for the bucket are enabled. After enabling the relevant mount page permission and WebDAV permission in the interface, the corresponding key base path mount path can be set (similarly mapped to the WebDAV path).

## Common Issue Resolutions:  

1. **Connection Issues**:  
   - If encountering a 405 error, confirm the WebDAV URL format is correct (use the backend domain as the address).  
   - Verify that authentication credentials are valid.  
   - Check whether the API key has mount permissions.  

2. **Permission Errors**:  
   - Ensure the account has the required permissions.  
   - Admin accounts should have full permissions.  
   - API keys must explicitly have mount permissions enabled.  

3. **⚠️⚠️ WebDAV Upload Issues**:  
   - For Worker deployments, WebDAV uploads may be limited by Cloudflare's Worker upload restrictions (~100MB).  
   - For Docker deployments, only the nginx proxy configuration needs attention, and upload methods are unrestricted.  
   - Windows clients (e.g., RaiDrive) do not currently support drag-and-drop uploads.

## Next Steps

- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
- [Configure S3 Storage](/en/guide/s3-config)
- [GitHub Actions Deployment](/en/guide/deploy-github-actions)
