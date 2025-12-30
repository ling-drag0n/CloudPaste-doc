# Local Storage Configuration

CloudPaste supports using the **local file system** as a storage backend, suitable for Node.js / Docker deployment environments.

## Supported Features

The local storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **WRITER**: Upload, create, rename, delete files
- ✅ **ATOMIC**: Atomic operation support (rename, copy, batch delete)
- ✅ **PROXY**: Proxy access

> **Note**: Local storage does not support DIRECT_LINK (direct links), MULTIPART (chunked upload), and PAGED_LIST (paginated directory listing) capabilities.

## 1. Applicable Scenarios

### 1.1 Recommended Scenarios

- **Self-hosted deployment**: Deploy directly on your own server using Docker or Node.js
- **Internal network environment**: No need to rely on external cloud storage services
- **Development and testing**: Quickly set up test environments
- **Small-scale applications**: Limited file volume, single-machine storage is sufficient

### 1.2 Not Applicable Scenarios

- ❌ **Cloudflare Workers deployment**: Workers environment cannot access the local file system
- ❌ **Serverless environments**: Serverless environments typically don't provide persistent file systems
- ❌ **Distributed deployment**: Local storage cannot be shared when deploying multiple instances

## 2. Creating a New Local Storage Configuration

1. Log in to CloudPaste backend → **Storage Configuration**
2. Click "Create New Storage Configuration"
3. Select **LOCAL** from the "Storage Type" dropdown
4. Fill in the configuration information (see below)
5. After saving, create a mount point for this storage in "Mount Management"

## 3. Field Description

### 3.1 Basic Information

- **Configuration Name**  
  Any recognizable name, such as "Local Storage" or "Server Disk"

- **Storage Capacity Limit** (Optional)
  - Only affects CloudPaste's own quota calculation
  - Triggers CloudPaste's quota limit warning when exceeded
  - Does not actually limit the host machine's disk space

### 3.2 Path Configuration

- **Root Directory Path (root_path)** *Required*
  - Absolute path of the local file system, serving as the storage root directory
  - Must be an absolute path, for example:
    - Linux/Mac: `/data/cloudpaste/storage`
    - Windows: `D:\cloudpaste\storage`
  - All file operations are restricted within this directory (jail mechanism)
  - The path must exist and be writable (unless `auto_create_root` is enabled)

- **Auto Create Root Directory (auto_create_root)** (Optional)
  - Default: `false` (disabled)
  - When checked: If `root_path` doesn't exist, the system will automatically create it
  - When unchecked: Must manually create the directory on the host machine

### 3.3 Permission Configuration

- **Directory/File Permission (dir_permission)** (Optional)
  - Octal permission value, for example: `0755`, `0777`
  - Default: `0777` (read, write, execute for all users)
  - Applied to both directories and files
  - Applicable scenario: For single-machine self-hosting, usually the default value is sufficient

### 3.4 Advanced Configuration

- **Read-only Mode (readonly)** (Optional)
  - Default: `false` (read-write allowed)
  - When checked: Prohibits all write and delete operations
  - Applicable scenario: Read-only mounts, archive storage

- **Trash Path (trash_path)** (Optional)
  - Move files to trash when deleting instead of permanent deletion
  - Supports relative paths (relative to `root_path`) or absolute paths
  - Examples:
    - Relative path: `.trash` (create .trash directory under root_path)
    - Absolute path: `/data/cloudpaste/trash`
  - When not configured: Delete operations are permanent

## 4. Mounting and Permission Coordination

After saving the local storage configuration, you need to create a mount point for it in "Mount Management":

1. Go to **Mount Management** → Create New Mount
2. Select the storage configuration with LOCAL storage type
3. Fill in the mount path (e.g., `/local`), notes, etc.
4. Enable as needed:
  - **Web Proxy**: Whether to force Web scenarios to go through CloudPaste proxy
  - **Enable Signature**: Whether to sign-protect `/api/p` / proxy entry points

Additionally, local storage configuration has an **Allow API Key Usage (is_public)** option:

- When checked, API keys can use this storage within their "mount path" range
- Combined with the API key's basic_path and mount path, you can precisely limit the access range

For detailed mounting and permission instructions, refer to:

- [Mount Management Guide](/guide/mount-management)
- [Storage / Mount Common Configuration](/guide/storage-common)

## 5. Security Mechanisms

### 5.1 Path Jail

- All file operations are strictly restricted within the `root_path` directory
- Automatically detects and prevents path traversal (`../` etc.)
- Symbolic link (symlink) security checks:
  - Detects if symbolic links point outside `root_path`
  - Prevents escaping to other directories through symbolic links

### 5.2 Permission Control

- Checks read/write permissions of `root_path` during initialization
- Prohibits all write operations in read-only mode
- File and directory permissions are configurable

### 5.3 Trash Mechanism

- When trash is configured, delete operations become moves to trash
- Timestamps are automatically added to filenames to avoid conflicts
- Supports cross-filesystem moves (automatically downgrades to copy+delete)

## 6. Common Issues

### 6.1 Initialization Failed: root_path Does Not Exist

**Error Message**:
```
LOCAL driver root_path does not exist, please manually create this directory on the host machine first
```

**Solution**:
1. Manually create the directory on the host machine: `mkdir -p /data/cloudpaste/storage`
2. Or check the "Auto Create Root Directory" option

### 6.2 Permission Error: root_path Not Writable

**Error Message**:
```
LOCAL driver root_path is not writable
```

**Solution**:
1. Check directory permissions: `ls -la /data/cloudpaste/`
2. Modify permissions: `chmod 755 /data/cloudpaste/storage`
3. Check directory owner: `chown -R user:group /data/cloudpaste/storage`

### 6.3 Unable to Access Within Docker Container

**Possible Reasons**:
- Volume not properly mounted
- Inconsistent paths between container and configuration
- Permission issues

**Solution**:
1. Check volumes configuration in docker-compose.yml
2. Confirm path inside container: `docker exec -it container_name ls -la /data/storage`
3. Check host machine directory permissions

### 6.4 Symbolic Link Access Denied

**Error Message**:
```
Symbolic link points outside root_path, access has been denied
```

**Reason**:
- Security mechanism prevents symbolic links from escaping outside `root_path`

**Solution**:
- Move the symbolic link target inside `root_path`
- Or use hard links/direct file copying

### 6.5 Cannot Use with Cloudflare Workers Deployment

**Error Message**:
```
LOCAL driver is only available in Node/Docker environments
```

**Reason**:
- Workers environment cannot access the local file system

**Solution**:
- Use cloud storage like S3, WebDAV, or OneDrive
- Or switch to Node.js / Docker deployment method

## 7. Performance Optimization Recommendations

### 7.1 Disk Selection

- **SSD Priority**: Better read/write performance
- **Avoid Network Disks**: NFS/CIFS will increase latency
- **RAID Configuration**: Choose RAID level according to needs

### 7.2 Directory Structure

- Avoid too many files in a single directory (recommended < 10000)
- Use reasonable subdirectory structure
- Regularly clean up trash

### 7.3 Permission Configuration

- For production environments, recommend using `0755` instead of `0777`
- Ensure CloudPaste process has sufficient permissions
- Avoid running as root user

## 8. Monitoring and Maintenance

### 8.1 Disk Space Monitoring

```bash
# Check disk usage
df -h /data/cloudpaste/storage

# Check directory size
du -sh /data/cloudpaste/storage
```

### 8.2 Trash Cleanup

```bash
# Check trash size
du -sh /data/cloudpaste/storage/.trash

# Clean up files older than 30 days
find /data/cloudpaste/storage/.trash -type f -mtime +30 -delete
```

### 8.3 Backup Recommendations

- Regularly backup the `root_path` directory
- Use tools like rsync, tar, etc.
- Consider incremental backup strategies

## 9. Reference Resources

- [Docker Deployment Guide](/guide/deploy-docker)
- [Mount Management Guide](/guide/mount-management)
- [Storage / Mount Common Configuration](/guide/storage-common)