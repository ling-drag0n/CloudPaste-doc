# Google Drive Storage Configuration

CloudPaste supports **Google Drive** as a storage backend, implementing file operations based on Google Drive v3 API.

## Supported Features

The Google Drive storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **WRITER**: Upload, create, rename, and delete files
- ✅ **ATOMIC**: Atomic operation support (batch delete, copy)
- ✅ **PROXY**: Proxy access
- ✅ **MULTIPART**: Chunked upload (resumable upload)
- ✅ **PAGED_LIST**: Paginated directory listing

## 1. Preparation

### 1.0 Follow OpenList Configuration Documentation (Recommended)

👉 https://doc.oplist.org/guide/drivers/google_drive

<details>
<summary><b>Click to expand: If created according to OpenList, please skip this step</b></summary>

### 1.1 Create a Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Record the project ID

### 1.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click "Enable"

![gd-0](/images/guide/GoogleDrive/gd-0.png)

### 1.3 Configure OAuth Consent Screen

1. Select user type (External)
2. Fill in application information:
    - **App name**: e.g., `CloudPaste`
    - **User support email**: Your email
    - **Developer contact information**: Your email

![gd-00](/images/guide/GoogleDrive/gd-00.png)

### 1.4 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → Select "OAuth client ID"
3. Select "Web application" as the application type
4. Fill in the name and add authorized redirect URIs (fill in the callback URL here, specifically refer to the callback address of the third-party tool)
5. After creation, record:
    - **Client ID**
    - **Client Secret**

![gd-1](/images/guide/GoogleDrive/gd-1.png)
![gd-2](/images/guide/GoogleDrive/gd-2.png)

6. Add yourself as a test user. Find the target audience menu on the left, click to enter, find the "+ Add Users" button below test users, click and enter your Google account email address, click Add, and publish after adding

![gd-4](/images/guide/GoogleDrive/gd-4.png)

7. At this point, the process is complete. Fill the previously obtained ID and secret directly into the third-party API tool, then click "Get Refresh Token" with "Do not use online address" selected, and then fill in the ID, secret, and refresh token sequentially in Cloudpaste's storage configuration

### 1.5 Get Refresh Token

#### Using Third-party Tools

You can use third-party tools such as [Google Drive Token Retrieval Tool](https://api.oplist.org/) to simplify the process.

### 1.6 Another Authentication Method

1. No ID and secret required. In the third-party API tool, check "Use online address" and click "Get directly" to obtain the refresh token
2. Fill the refresh token into Cloudpaste's storage configuration, enable the "online address" checkbox, and also fill in the online API address
3. At this point, only the "online API address" and refresh token are needed in the configuration to complete the setup.
</details>

## 2. Create Google Drive Storage Configuration

1. Log in to CloudPaste admin panel → **Storage Configuration**
2. Click "Create Storage Configuration"
3. Select **Google Drive** from the "Storage Type" dropdown
4. Fill in configuration information (see below)
5. After saving, create a mount point for this storage in "Mount Management"

## 3. Field Descriptions

### 3.1 Basic Information

- **Configuration Name**
  Any recognizable name, e.g., "Personal Google Drive", "Team Shared Drive"

- **Storage Capacity Limit** (Optional)
  - Only affects CloudPaste's own quota calculation
  - Triggers CloudPaste's quota warning when exceeded

### 3.2 Authentication Configuration

> These fields determine how CloudPaste connects to your Google Drive

- **Client ID (client_id)** *Required*
  - Google Cloud OAuth client ID
  - Example: `123456789012-xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

- **Client Secret (client_secret)** *Required*
  - Google Cloud OAuth client secret
  - Encrypted and stored in backend
  - Leave empty when editing to keep existing value

- **Refresh Token (refresh_token)** *Required*
  - OAuth 2.0 refresh token
  - Used to automatically obtain and refresh access tokens
  - Encrypted and stored in backend

### 3.3 Advanced Configuration

- **Root ID (root_id)** (Optional)
  - Specify the starting directory ID in Google Drive
  - Leave empty to default to `root` (user's Drive root)
  - For Shared Drives: Enter the Shared Drive ID
  - Example: `0B1234567890abcdefghij`

- **Enable Disk Usage Statistics (enable_disk_usage)** (Optional)
  - When enabled, view quota usage in storage details
  - Uses Google Drive's `about.get` API to fetch storage quota

- **Enable "Shared with me" View (enable_shared_view)** (Optional, enabled by default)
  - When enabled, a virtual directory `__shared_with_me__` appears under the mount root
  - Browse files shared with you by other users
  - Note: This directory is read-only

- **Token Refresh Endpoint (api_address)** (Optional)
  - Custom URL for token refresh service
  - If not set, uses Google's official OAuth endpoint
  - Use case: Third-party token management services

- **Use Online API (use_online_api)** (Optional)
  - When enabled, uses Online API protocol to call token refresh endpoint
  - Only effective when `api_address` is configured

## 4. Special Features

### 4.1 "Shared with me" Virtual View

When `enable_shared_view` is enabled, a virtual directory named `__shared_with_me__` appears under the mount root:

- **Purpose**: Browse files and folders shared with you by other Google Drive users
- **Characteristics**:
  - Read-only view, upload or modification not supported in this directory
  - Files are actually stored in the sharer's Drive
  - Supports download and preview of shared files
- **Disable**: Uncheck in storage configuration if not needed

### 4.2 Shared Drives Support

If you're using Google Workspace Shared Drives:

1. Enter the Shared Drive ID in `root_id`
2. Ensure the OAuth account has permission to access that Shared Drive
3. All file operations will be performed in that Shared Drive

### 4.3 Chunked Upload

Google Drive storage supports resumable chunked upload:

- Automatically handles large file uploads
- Supports frontend direct upload mode
- Empty files (0 bytes) are created via metadata, no upload traffic consumed

## 5. Mount and Permission Configuration

After saving Google Drive storage configuration, create a mount point in "Mount Management":

1. Go to **Mount Management** → Create new mount
2. Select the Google Drive storage configuration
3. Fill in mount path (e.g., `/gdrive`), notes, etc.
4. Enable as needed:
   - **Web Proxy**: Force web scenarios to use CloudPaste proxy
   - **Enable Signature**: Signature protection for `/api/p` / proxy endpoint
   - **Direct Link Strategy**: `native_direct` / `proxy` / `use_proxy_url`

Additionally, the **Allow API Key Usage (is_public)** option in Google Drive storage configuration:

- When enabled, API keys can use this storage within their "mount path" scope
- Combined with API key's basic_path and mount path, precisely limit access scope

For detailed mount and permission documentation, refer to:

- [Mount Management Guide](/en/guide/mount-management)
- [Storage/Mount Common Settings](/en/guide/storage-common)

## 6. FAQ

### 6.1 Connection Failed / Unable to Get Access Token

**Possible causes:**
- Incorrect `client_id` or `client_secret`
- `refresh_token` expired or invalid
- Drive API not enabled in Google Cloud project
- OAuth consent screen not configured correctly

**Solutions:**
1. Check Google Cloud project configuration
2. Confirm Drive API is enabled
3. Re-obtain refresh_token
4. Check OAuth consent screen scope settings

### 6.2 Upload Failed or Slow Speed

**Possible causes:**
- High network latency
- Google Drive API throttling
- File too large

**Solutions:**
1. Check network connection between CloudPaste and Google Drive
2. Large file uploads automatically use resumable upload
3. If throttled, retry later

### 6.3 Refresh Token Expired

**Symptoms:**
- "Unable to get access token" error
- Logs show "invalid_grant" error

**Solutions:**
1. Refresh token may have expired due to long inactivity
2. Re-execute authorization flow to get new refresh_token
3. Update storage configuration in CloudPaste

### 6.4 Cannot Access Shared Drive

**Possible causes:**
- Incorrect `root_id`
- OAuth account has no permission to access the Shared Drive

**Solutions:**
1. Confirm Shared Drive ID is correct (can be obtained from Google Drive web URL)
2. Ensure authorized account is a member of the Shared Drive
3. Check if OAuth scope includes `drive` permission

### 6.5 "Shared with me" Directory Not Showing

**Possible cause:**
- `enable_shared_view` not enabled

**Solutions:**
1. Edit storage configuration, check "Enable 'Shared with me' view"
2. Refresh directory list after saving

## 7. Reference Resources

- [OpenList Google Drive Configuration](https://doc.oplist.org/guide/drivers/google_drive)
- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Authorization Flow](https://developers.google.com/identity/protocols/oauth2)
