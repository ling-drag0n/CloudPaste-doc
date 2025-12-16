# GitHub Releases Storage Configuration

CloudPaste supports **GitHub Releases** as a read-only storage backend, mapping GitHub repository Release assets as a virtual file system view.

## Supported Features

The GitHub Releases storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **DIRECT_LINK**: Generate direct download links
- ✅ **PROXY**: Proxy access
- ❌ **WRITER**: Upload/modify not supported
- ❌ **ATOMIC**: Batch operations not supported
- ❌ **MULTIPART**: Chunked upload not supported

> **Note**: GitHub Releases storage is **read-only** mode, does not support uploading, deleting, or modifying any files.

## 1. Preparation

### 1.1 Identify Target Repository

1. Ensure the target GitHub repository has published Releases
2. Note the repository's `owner` (username or organization name) and `repo` (repository name)
3. Example: `ling-drag0n/CloudPaste`

### 1.2 Get Access Token (Optional)

If you need to access **private repositories**, create a GitHub Personal Access Token:

1. Visit [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select required permissions:
   - `repo` (access private repos)
   - Or `public_repo` (access public repos only)
4. Generate and save the token

> **Public repositories** can be accessed without configuring a token.

## 2. Create GitHub Releases Storage Configuration

1. Log in to CloudPaste admin panel → **Storage Configuration**
2. Click "Create Storage Configuration"
3. Select **GitHub Releases** from the "Storage Type" dropdown
4. Fill in configuration information (see below)
5. After saving, create a mount point for this storage in "Mount Management"

## 3. Field Descriptions

### 3.1 Basic Information

- **Configuration Name**
  Any recognizable name, e.g., "CloudPaste Releases", "Open Source Releases"

- **Storage Capacity Limit** (Optional)
  - Only affects CloudPaste's own quota calculation
  - GitHub Releases has no actual capacity limit concept

### 3.2 Repository Structure Configuration

> Core configuration for GitHub Releases storage

- **Repository Structure (repo_structure)** *Required*

  Define the list of GitHub repositories to mount, one configuration per line:

  **Supported formats:**

  | Format | Description | Example |
  |--------|-------------|---------|
  | `owner/repo` | Recommended format, mounts directly to root for single repo | `ling-drag0n/CloudPaste` |
  | `alias:owner/repo` | Custom directory name, required for multiple repos | `cloudpaste:ling-drag0n/CloudPaste` |
  | `https://github.com/owner/repo` | Full URL format | `https://github.com/ling-drag0n/CloudPaste` |

  **Configuration rules:**
  - One configuration per line, empty lines and lines starting with `#` are ignored
  - **Single repository**: Can use `owner/repo` directly, files displayed in mount root
  - **Multiple repositories**: Must specify alias for each line (`alias:owner/repo`) to avoid directory conflicts

  **Example configurations:**

  ```
  # Single repository configuration (mounts directly to root)
  ling-drag0n/CloudPaste
  ```

  ```
  # Multiple repository configuration (each repo has its own directory)
  cloudpaste:ling-drag0n/CloudPaste
  vscode:microsoft/vscode
  node:nodejs/node
  ```

### 3.3 Display Options

- **Show All Versions (show_all_version)** (Default: off)
  - **Off**: Only show latest Release assets (flat list)
  - **On**: Show all Release versions, each version as a subdirectory (named by tag_name)

- **Show README (show_readme)** (Default: off)
  - When enabled, displays `README.md` and `LICENSE` files under the repository directory
  - These files come from the repository root, not Release assets

- **Show Source Code (show_source_code)** (Default: off)
  - When enabled, each Release directory shows:
    - `Source code (zip)` - Source code ZIP archive
    - `Source code (tar.gz)` - Source code TAR.GZ archive
  - These are auto-generated source code archives by GitHub

- **Show Release Notes (show_release_notes)** (Default: off)
  - When enabled, each Release directory shows a `RELEASE_NOTES.md` virtual file
  - Content is the Release's release notes (release.body)
  - Only displayed when the Release has release notes

### 3.4 Advanced Configuration

- **GitHub Token (token)** (Optional)
  - Personal Access Token for accessing private repositories
  - Not required for public repositories
  - Encrypted and stored in backend

- **Per Page (per_page)** (Default: 20)
  - Number of items per page when fetching Releases list
  - Range: 1-100
  - Larger values can reduce API request count

- **GitHub Proxy (gh_proxy)** (Optional)
  - Proxy address for accelerating GitHub downloads
  - Example: `https://mirror.ghproxy.com`
  - Only replaces download links starting with `https://github.com`

## 4. Directory Structure

### 4.1 "Show All Versions" Off (Default)

```
/mount-point/
├── asset1.zip          # Latest Release assets
├── asset2.exe
├── README.md           # If show_readme enabled
├── LICENSE
├── Source code (zip)   # If show_source_code enabled
├── Source code (tar.gz)
└── RELEASE_NOTES.md    # If show_release_notes enabled
```

### 4.2 "Show All Versions" On

```
/mount-point/
├── v1.0.0/             # Release tag as directory name
│   ├── asset1.zip
│   ├── asset2.exe
│   ├── Source code (zip)
│   ├── Source code (tar.gz)
│   └── RELEASE_NOTES.md
├── v0.9.0/
│   └── ...
├── README.md           # If show_readme enabled (repo level)
└── LICENSE
```

### 4.3 Multiple Repository Configuration

```
/mount-point/
├── cloudpaste/         # Alias as directory name
│   ├── v1.0.0/
│   └── ...
├── vscode/
│   ├── 1.85.0/
│   └── ...
└── node/
    ├── v20.10.0/
    └── ...
```

## 5. Mount and Permission Configuration

After saving GitHub Releases storage configuration, create a mount point in "Mount Management":

1. Go to **Mount Management** → Create new mount
2. Select the GitHub Releases storage configuration
3. Fill in mount path (e.g., `/releases`), notes, etc.
4. Enable as needed:
   - **Web Proxy**: Force web scenarios to use CloudPaste proxy
   - **Enable Signature**: Signature protection for `/api/p` / proxy endpoint
   - **Direct Link Strategy**: `native_direct` / `proxy`

Additionally, the **Allow API Key Usage (is_public)** option in GitHub Releases storage configuration:

- When enabled, API keys can use this storage within their "mount path" scope
- Combined with API key's basic_path and mount path, precisely limit access scope

For detailed mount and permission documentation, refer to:

- [Mount Management Guide](/en/guide/mount-management)
- [Storage/Mount Common Settings](/en/guide/storage-common)

## 6. FAQ

### 6.1 Cannot Access Private Repository

**Possible causes:**
- Token not configured
- Token permissions insufficient
- Token expired

**Solutions:**
1. Create a new Personal Access Token
2. Ensure it has `repo` permission
3. Enter token in storage configuration

### 6.2 Release List is Empty

**Possible causes:**
- Repository has no published Releases
- repo_structure format is incorrect
- Repository name or username spelling error

**Solutions:**
1. Confirm repository has published Releases (not pre-release or draft)
2. Check repo_structure format is correct
3. Test using full URL format: `https://github.com/owner/repo`

### 6.3 Slow Download Speed

**Possible causes:**
- Slow network connection to GitHub
- Acceleration proxy not configured

**Solutions:**
1. Configure `gh_proxy` with GitHub acceleration mirror
2. Common mirrors:
   - `https://mirror.ghproxy.com`
   - `https://gh.api.99988866.xyz`
3. Or configure mount proxy strategy to use local proxy

### 6.4 Multiple Repository Configuration Error

**Error message:**
> GitHub Releases multi-repository configuration requires alias for each line

**Solution:**
Multiple repositories must use `alias:owner/repo` format:

```
# Wrong example
ling-drag0n/CloudPaste
microsoft/vscode

# Correct example
cloudpaste:ling-drag0n/CloudPaste
vscode:microsoft/vscode
```

### 6.5 Source Code File Size Shows as 1

**Explanation:**
- GitHub's zipball/tarball URLs don't provide accurate file sizes
- CloudPaste displays 1 to indicate "size unknown"
- Actual download will get the complete file

### 6.6 RELEASE_NOTES.md Not Showing

**Possible causes:**
- `show_release_notes` option not enabled
- The Release has no release notes (release.body is empty)
- There's a real asset file with the same name (real file takes priority)

**Solutions:**
1. Confirm "Show Release Notes" option is enabled
2. Check if Release has release notes content

## 7. API Rate Limits

GitHub API has request frequency limits:

| Scenario | Limit |
|----------|-------|
| Unauthenticated requests | 60 requests/hour |
| Token authenticated requests | 5000 requests/hour |

**Recommendations:**
- Even for public repositories, configuring a token is recommended to increase request quota
- CloudPaste uses in-memory caching to reduce duplicate requests
- Cache TTL can be set via mount's `cache_ttl` setting (default 60 seconds)

## 8. Reference Resources

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [GitHub REST API - Releases](https://docs.github.com/en/rest/releases/releases)
- [Creating Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
