# GitHub API Storage Configuration

CloudPaste supports **GitHub repositories** as a read-write storage backend, implementing complete file CRUD operations through GitHub Contents API and Git Database API.

## Supported Features

The GitHub API storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **DIRECT_LINK**: Generate direct download links
- ✅ **PROXY**: Proxy access
- ✅ **WRITER**: Upload, create, rename, delete files (branch mode only)
- ✅ **ATOMIC**: Atomic operation support (branch mode only)
- ❌ **MULTIPART**: Chunked upload not supported

> **Note**:
> - Write operations (upload/delete/rename) are only available when `ref` points to a **branch**
> - If `ref` points to a tag or commit sha, it will be **read-only** mode
> - GitHub single file size limit is **100MB**

## 1. Preparation

### 1.1 Identify Target Repository

1. Ensure you have a GitHub repository (can be empty)
2. Note the repository's `owner` (username or organization name) and `repo` (repository name)
3. Example: `ling-drag0n/my-storage`

### 1.2 Create Access Token

GitHub API storage requires a Personal Access Token for authentication:

1. Visit [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select required permissions:
   - **Read-only access**: `repo` (private repos) or `public_repo` (public repos)
   - **Read-write access**: `repo` (full repository access)
4. Generate and save the token

> **Important**: Token needs `repo` permission to perform write operations.

## 2. Create GitHub API Storage Configuration

1. Log in to CloudPaste admin panel → **Storage Configuration**
2. Click "Create Storage Configuration"
3. Select **GitHub API** from the "Storage Type" dropdown
4. Fill in configuration information (see below)
5. After saving, create a mount point for this storage in "Mount Management"

## 3. Field Descriptions

### 3.1 Basic Information

- **Configuration Name**
  Any recognizable name, e.g., "GitHub File Storage", "Project Resources"

- **Storage Capacity Limit** (Optional)
  - Only affects CloudPaste's own quota calculation
  - GitHub repositories have no strict storage limit (but recommended to keep under 5GB)

### 3.2 Repository Configuration

> Core configuration for GitHub API storage

- **Repository Owner (owner)** *Required*
  - GitHub username or organization name
  - Examples: `ling-drag0n`, `microsoft`

- **Repository Name (repo)** *Required*
  - Target repository name
  - Examples: `CloudPaste`, `my-storage`

- **Access Token (token)** *Required*
  - GitHub Personal Access Token
  - Needs `repo` permission for write operations
  - Encrypted and stored in backend

- **Branch/Reference (ref)** (Optional)
  - Specify the Git reference to operate on
  - Supported formats:
    - Branch name: `main`, `master`, `develop`
    - Full reference: `refs/heads/main`, `heads/main`
    - Tag: `refs/tags/v1.0.0`, `tags/v1.0.0`
    - Commit SHA: `a1b2c3d4...`
  - Leave empty to use repository's default branch
  - **Note**: Only branches support write operations; tag/commit sha are read-only

### 3.3 Advanced Configuration

- **Default Upload Path (default_folder)** (Optional)
  - Specify default target directory for file uploads
  - Only affects "File Upload Page / Share Upload" default directory
  - Does not affect mount browse root directory
  - Examples: `uploads/`, `assets/files`

- **API Address (api_base)** (Optional)
  - Custom GitHub API endpoint
  - Default: `https://api.github.com`
  - Suitable for GitHub Enterprise Server

- **GitHub Proxy (gh_proxy)** (Optional)
  - Proxy address for accelerating `raw.githubusercontent.com` downloads
  - Only applies to direct links for public repositories
  - Example: `https://mirror.ghproxy.com`

- **Committer Name (committer_name)** (Optional)
  - Committer name for Git commits
  - Leave empty to use GitHub defaults

- **Committer Email (committer_email)** (Optional)
  - Committer email for Git commits
  - Leave empty to use GitHub defaults

- **Author Name (author_name)** (Optional)
  - Author name for Git commits
  - Leave empty to use GitHub defaults

- **Author Email (author_email)** (Optional)
  - Author email for Git commits
  - Leave empty to use GitHub defaults

## 4. How It Works

### 4.1 Read Operations

- Uses GitHub Contents API to list directories and get file information
- Public repositories download files via `raw.githubusercontent.com`
- Private repositories download files via Contents API (with Token)

### 4.2 Write Operations

GitHub API storage implements writes through Git Database API:

1. **Create Blob**: Encode file content as base64 and create Git blob
2. **Build Tree**: Create new tree based on current commit tree (containing changes)
3. **Create Commit**: Create new commit pointing to new tree
4. **Update Ref**: Point branch reference to new commit

This approach ensures each file operation generates a standard Git commit.

### 4.3 Empty Repository Initialization

If the target repository is empty (no commits):
- CloudPaste will automatically create the first commit
- Creates `.gitkeep` file in repository root as initialization marker

## 5. File Size Limits

| Limit Type | Size |
|-----------|------|
| Single file limit | 100MB |
| Recommended repository size | < 5GB |

> **Tip**: For storing large files, consider using Git LFS or switching to S3/OneDrive storage types.

## 6. Mount and Permission Configuration

After saving GitHub API storage configuration, create a mount point in "Mount Management":

1. Go to **Mount Management** → Create new mount
2. Select the GitHub API storage configuration
3. Fill in mount path (e.g., `/github`), notes, etc.
4. Enable as needed:
   - **Web Proxy**: Force web scenarios to use CloudPaste proxy
   - **Enable Signature**: Signature protection for `/api/p` / proxy endpoint
   - **Direct Link Strategy**: `native_direct` / `proxy`

Additionally, the **Allow API Key Usage (is_public)** option in GitHub API storage configuration:

- When enabled, API keys can use this storage within their "mount path" scope
- Combined with API key's basic_path and mount path, precisely limit access scope

For detailed mount and permission documentation, refer to:

- [Mount Management Guide](/en/guide/mount-management)
- [Storage/Mount Common Settings](/en/guide/storage-common)

## 7. FAQ

### 7.1 Cannot Write Files

**Possible causes:**
- `ref` points to tag or commit sha (read-only mode)
- Token permissions insufficient (missing `repo` permission)
- Branch does not exist

**Solutions:**
1. Ensure `ref` points to a branch (e.g., `main`)
2. Check if Token has `repo` permission
3. Verify branch name spelling

### 7.2 Upload Failed: File Too Large

**Error message:**
> File too large: GitHub single file maximum is 100MB

**Solutions:**
1. Compress file before uploading
2. Split large file into multiple smaller files
3. Switch to S3/OneDrive or other storage types that support large files
4. Consider using Git LFS (requires repository configuration)

### 7.3 Initialization Failed: Empty Repository

**Possible cause:**
- Repository is empty and cannot resolve default branch

**Solutions:**
1. Manually create an initial file on GitHub web interface
2. Or explicitly specify `ref` in configuration (e.g., `main`)

### 7.4 Slow Download Speed (Public Repository)

**Solutions:**
1. Configure `gh_proxy` with acceleration mirror
2. Or enable proxy mode in mount settings

### 7.5 Commit Records Show Wrong Author

**Solutions:**
1. Set `committer_name` and `committer_email` in storage configuration
2. Optionally set `author_name` and `author_email`

### 7.6 Git Submodule Access Not Supported

**Description:**
- GitHub API storage does not support accessing Git submodules
- Attempting to access submodule paths will return an error

**Solutions:**
- Avoid using paths in repositories containing submodules
- Or place required files directly in the main repository

### 7.7 Directory Operation Failed: Trees Response Truncated

**Error message:**
> GitHub trees response truncated (truncated=true)

**Possible cause:**
- Directory contains too many files (exceeds GitHub API single response limit)

**Solutions:**
1. Reduce the number of files in a single directory
2. Use deeper directory structure to distribute files

## 8. API Rate Limits

GitHub API has request frequency limits:

| Scenario | Limit |
|----------|-------|
| Token authenticated requests | 5000 requests/hour |

**Notes:**
- Each file write operation consumes multiple API requests (blob + tree + commit + ref)
- CloudPaste has built-in write throttling mechanism (default 1 second interval)
- Built-in exponential backoff retry mechanism handles rate limit responses

## 9. Difference from GitHub Releases Storage

| Feature | GitHub API | GitHub Releases |
|---------|-----------|-----------------|
| Access content | Repository files | Release assets |
| Write support | ✅ Supported (branch mode) | ❌ Not supported |
| Single file size | 100MB | 2GB (GitHub limit) |
| Use case | File storage, config management | Software releases, version distribution |

## 10. Reference Resources

- [GitHub Contents API](https://docs.github.com/en/rest/repos/contents)
- [GitHub Git Database API](https://docs.github.com/en/rest/git)
- [Creating Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub API Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
