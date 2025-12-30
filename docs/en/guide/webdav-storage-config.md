# WebDAV Storage Configuration

Besides S3-compatible object storage, CloudPaste can also use **external WebDAV services** as a storage backend.

Common use cases:

- You already have a NAS / Nextcloud / Cloudreve that exposes WebDAV and want to reuse it for CloudPaste;
- You cannot easily use S3, but you do have a stable WebDAV service.

## Supported Features

The WebDAV storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **WRITER**: Upload, create, rename, delete files
- ✅ **ATOMIC**: Atomic operation support (rename, copy, batch delete)
- ✅ **PROXY**: Proxy access

> **Note**: WebDAV storage **does not support DirectLink capability**. Access paths go through CloudPaste's proxy chain or upstream WebDAV. It also does not support MULTIPART (chunked upload) and PAGED_LIST (paginated directory listing).

## 1. Creating a WebDAV Storage Config

1. Log in to the admin panel → **Storage Config**.  
2. Click “Create Storage Config”.  
3. In “Storage Type”, select **WebDAV**.  
4. Fill in basic info (name, capacity) and connection settings (endpoint, credentials, etc.).  
5. Save, then go to “Mount Management” to create a mount for this storage before using it.

> Recommended: start with a small test file to verify listing/upload, then migrate more data.

## 2. Field Reference

### 2.1 Basic Info

- **Name**  
  Any label that is easy to recognize, such as “Home NAS WebDAV” or “Nextcloud Storage”.

- **Storage Capacity Limit** (optional)  
  - Only affects CloudPaste’s own quota calculation, it does **not** actually limit the remote WebDAV disk.  
  - When exceeded, CloudPaste will show warnings to help avoid accidentally filling up the remote storage.

### 2.2 Connection Settings

> These fields control how CloudPaste connects to your WebDAV service.

- **WebDAV Endpoint (endpoint_url)**  
  - Examples:
    - `https://dav.example.com/dav/`
    - `https://nextcloud.example.com/remote.php/dav/files/username/`
  - Requirements:
    - Must include protocol (`http://` or `https://`);
    - It is recommended to end with `/` to keep path concatenation simple;
    - This should be the WebDAV root URL, or the root URL of a specific subdirectory.

- **Username / Password**  
  - Credentials for the WebDAV service;
  - The password is stored encrypted in the backend and only decrypted when testing or doing real operations;
  - When editing, leaving the password empty means “do not change the existing password”.

- **Default Upload Path (default_folder)** (optional)  
  - A subdirectory **relative to the WebDAV endpoint**.  
  - Format: without a leading `/`, for example:
    - `cloudpaste/`
    - `cloudpaste/files`
  - `..` is not allowed to avoid path escape; empty means using the endpoint root.  
  - The actual WebDAV path will be:  
    `endpoint_url` + `default_folder` + internal CloudPaste path.

- **TLS Certificate Check (tls_insecure_skip_verify)**  
  - When “Skip self-signed certificate validation” is checked:
    - If the endpoint is `https://` and uses self-signed / incomplete chain certificates, CloudPaste will ignore certificate errors and still connect;
    - Suitable for internal/self-hosted environments.  
  - For production on the public internet, it is recommended to **fix certificates properly** and leave this unchecked.

### 2.3 Proxy URL (url_proxy, advanced)

> Only needed when you have deployed [Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js) or a similar edge proxy. Semantics are aligned with the S3 “Proxy URL”.

- Location: **Storage Config → Advanced Settings → Proxy URL**
- Purpose:
  - Specifies a unified proxy entry domain for this WebDAV storage, e.g. `https://proxy.example.com`;
  - When combined with mount WebDAV policy `use_proxy_url`, WebDAV reads will redirect to  
    `https://proxy.example.com/proxy/fs/...`.
- If left empty:
  - WebDAV storage still works normally;
  - WebDAV access uses `native_proxy` or `302_redirect` depending on the mount’s WebDAV policy.

For the combination of WebDAV policy and Proxy URL, see:  
[Storage / Mount Common Settings](/en/guide/storage-common#5-webdav-policy-webdav-policy).

## 3. Mounts and Permissions

After saving the WebDAV storage config, you need to create a mount in “Mount Management”:

1. Go to **Mount Management** → create a mount;  
2. Select the storage config whose type is WebDAV;  
3. Set a mount path (e.g. `/webdav`) and remark;  
4. Configure, as needed:
   - **Web Proxy**: whether to force web scenarios through the CloudPaste proxy;  
   - **Enable signing**: whether to protect `/api/p` / proxy URLs with signatures;  
   - **WebDAV Policy**: choose `native_proxy` / `302_redirect` / `use_proxy_url`.

In the WebDAV storage config, there is also an **“Allow API key usage” (is_public)** option:

- When enabled, API keys can use this storage within their configured mount paths;
- Combined with the API key’s basic_path and mount paths, you can tightly restrict the access scope.

For more details on mounts and permissions:

- [Mount Management Guide](/en/guide/mount-management)  
- [Storage / Mount Common Settings](/en/guide/storage-common)

## 4. Common Configuration Examples

### 4.1 Self-hosted WebDAV (NAS / other NAS-like devices)

1. Enable WebDAV service on your NAS and confirm it can be opened in a browser:  
   `https://nas.example.com:5006/webdav/`
2. In CloudPaste, create a WebDAV storage config:
   - WebDAV Endpoint: `https://nas.example.com:5006/webdav/`
   - Username / Password: the WebDAV account on the NAS;
   - Default Upload Path: `cloudpaste/` (optional);
   - TLS: if using a self-signed cert, you may temporarily enable “Skip self-signed certificate validation”.
3. Create a mount: mount path like `/nas`, then choose a WebDAV policy as needed.

### 4.2 Nextcloud / self-hosted web drive

1. Find your WebDAV URL in Nextcloud, for example:  
   `https://nextcloud.example.com/remote.php/dav/files/username/`
2. In CloudPaste:
   - WebDAV Endpoint: the URL above;
   - Username / Password: your Nextcloud login credentials;
   - Default Upload Path: e.g. `cloudpaste/` or leave empty;
3. Choose the WebDAV policy according to Nextcloud’s performance and bandwidth:
   - Internal network / low traffic: `native_proxy`;
   - Want to offload via edge proxy: configure Proxy URL + `use_proxy_url`.

## 5. FAQs

- **Connection fails / cannot list directory**  
  - Check if the endpoint URL works in a browser (it should prompt for WebDAV credentials);  
  - Verify username/password;  
  - If using self-signed https, try enabling “Skip self-signed certificate validation”.

- **Upload fails or is very slow**  
  - Check latency and bandwidth between CloudPaste and the WebDAV server;  
  - Avoid using high-latency public WebDAV as the main storage;  
  - For heavy uploads, prefer an S3-compatible storage.

- **WebDAV download behavior does not match expectations**  
  - Confirm the mount’s WebDAV policy (`native_proxy` / `302_redirect` / `use_proxy_url`);  
  - If Proxy URL is used, ensure Cloudpaste-Proxy.js is deployed and configured correctly.

