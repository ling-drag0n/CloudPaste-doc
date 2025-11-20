# Mount Management Guide

A mount point acts as a virtual directory to map a corresponding storage path. Follow these three steps:

## 1. What is Mounting?
- **Mount Point = A Storage Entry**: Maps a storage configuration (S3/R2/OSS/B2, etc.) to CloudPaste’s directory tree. For example, mapping an R2 bucket `my-bucket` to `/r2`.
- **Who Can See It?** Depends on permissions and `basic_path`: Admins see everything, while API Key users can only browse within their own `basic_path`.
- **What Can You Do?** Browse, upload, rename, delete, copy, generate direct/proxy links, and perform WebDAV read/write operations.

> **Tip**: Mounting does not duplicate data—it simply attaches storage to a filesystem path.

## 2. Prerequisites
1) **Configure Storage First**: Ensure the corresponding S3-compatible/other storage configuration is added and tested under **Storage Settings**.
2) **Verify Permissions**: Assign mount permissions (`MOUNT_*` flags) and `basic_path` to API Keys to prevent privilege escalation.
3) **Plan the Mount Path**: Choose a directory name for the mount point (e.g., `/public`, `/team-share`).

## 3. Quick Start in Three Steps
### Step 1: Create a Mount Point
- Go to **Dashboard → Mount Management → New Mount**.
- Select a storage configuration, enter the mount path (e.g., `/r2`), add a note if needed (for environment distinction), and save.

### Step 2: Optional Toggles
- **Proxy Mode**: When enabled, file access goes through backend signing/relay—ideal for hiding origin direct links (relayed via the server).
- **Signing Duration**: Sets temporary link validity (in seconds). `0` means permanent (no expiration).
- **Default Link/Proxy**: Specifies the default strategy for generating links under this mount.
- **Cache TTL**: Duration (in seconds) for directory listing caching. Improves performance for frequently accessed but rarely changed files.
- **Enable/Disable**: When `is_active` is off, the mount becomes invisible to all users. Can be re-enabled anytime.
- **Sort Order**: Lower `sort_order` values appear first—useful for prioritizing frequently used mounts.
- **WebDAV Policy**: Default is `302_redirect` (recommended). Keep this unless specific needs arise.

### Step 3: Verify
- Access the `/r2` path in the **Mount Browser**—if files are listed, it works.
- For API Keys, ensure `basic_path` covers the mount path; otherwise, it won’t be visible.
- If the folder is image/media-heavy, use the view toggle (top-right) to switch to the **waterfall/masonry** layout for better mixed-size previews.

## 4. Field Reference
- **Mount Path**: The directory name in the filesystem (must start with `/`).
- **Storage Config**: References an S3/R2/OSS configuration.
- **Default Proxy**: Prioritizes backend proxy for generated links.
- **Signing Expiry**: Proxy link validity (seconds). `0` = no expiration.
- **Cache TTL**: Duration (seconds) for directory listing caching. Controls refresh frequency.
- **WebDAV Policy**: Behavior for WebDAV access (e.g., `302_redirect`). Keep default unless necessary.
- **Enable Status**: Determines mount visibility. Disabling doesn’t delete data.
- **Sort Order**: Adjusts position in the list for easier navigation.

## 5. Common Use Cases
- **Public Download Area**: Mount `/public`, disable proxy, and use direct links. Assign `basic_path=/public` to guest API Keys. Alternatively, aggregate multiple storages under paths like `/public/r2` or `/public/b2`.
- **Internal Files**: Mount `/internal`, enable proxy + 3600-second signing to prevent direct link leaks.
- **Department Isolation**: Create mounts like `/ops` and `/rd`, assign different `basic_path` values to API Keys for mutual invisibility.
- **Maintenance Mode**: Disable the mount (`is_active=false`) to hide unfinished data, then re-enable post-maintenance.

## 6. Troubleshooting
- **Mount Not Visible**: Check if the API Key’s `basic_path` matches the mount path.
- **Link Generation Error**: Verify storage config availability and proxy/signing settings.
- **403/No Permission**: Ensure mount permissions (`MOUNT_VIEW/UPLOAD/DELETE`, etc.) are enabled.
- **Stale List Data**: Wait for cache TTL to expire or manually refresh via **Cache Cleanup** (admin-only).

**Summary**:
1. Set up a **Storage Config**.
2. Create a **Mount Point**.
3. Define visibility and access rules using permissions, proxy, and signing.
