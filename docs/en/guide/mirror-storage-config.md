# Mirror Storage Configuration

CloudPaste supports using **HTTP mirror sites** as read-only storage backends, enabling file browsing and downloading by parsing mirror site directory pages.

Common use cases:

- Unified access to multiple open-source mirror sites through CloudPaste;
- Permission control and access management for mirror site resources;
- Proxy access capability for mirror site resources.

> Mirror storage driver is a **read-only driver**, it does not support uploading, deleting, or modifying files.


## Supported Features

Mirror storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **DIRECT_LINK**: Direct access to original mirror site URL
- ✅ **PROXY**: Proxy access to mirror resources
- ❌ **WRITER**: Not supported (read-only driver)
- ❌ **MULTIPART**: No multipart upload

> **Notes**:
> - This is a read-only driver, all write operations will be rejected
> - Frequent requests may trigger upstream mirror site rate limiting (HTTP 403)


## 1. Prerequisites

### 1.1 Choose a Mirror Site

Three preset templates are currently supported:

| Preset | Mirror Site | Description |
|--------|-------------|-------------|
| `tuna` | Tsinghua University Open Source Software Mirror | Most comprehensive resources, fastest updates |
| `ustc` | University of Science and Technology of China Mirror | Good stability, fast access on education network |
| `aliyun` | Alibaba Cloud Open Source Mirror | Commercial mirror in China, stable speed |

### 1.2 Verify Mirror Site Accessibility

Before configuration, ensure the target mirror site is accessible:

- Tsinghua TUNA: https://mirrors.tuna.tsinghua.edu.cn/
- USTC: https://mirrors.ustc.edu.cn/
- Alibaba Cloud: https://mirrors.aliyun.com/

> **No Token Required**: Mirror driver doesn't need any authentication, it directly accesses public mirror site directories.


## 2. Create Mirror Storage Configuration

1. Log in to CloudPaste admin → **Storage Configuration**
2. Click "New Storage Configuration"
3. Select **Mirror** from the "Storage Type" dropdown
4. Fill in configuration details (see field descriptions below)
5. Click "Test Connection" to verify the configuration
6. After saving, create a mount point for this storage in "Mount Management"

> We recommend testing the connection first to confirm the root directory can be listed before saving.


## 3. Field Reference

### 3.1 Basic Information

- **Configuration Name**
  Any memorable name, e.g., "Tsinghua Mirror", "USTC Mirror".

- **Storage Capacity Limit** (optional)
  - Only affects CloudPaste's quota calculation, doesn't actually limit mirror site access.
  - Mirror sites are public resources with no storage limit concept.

### 3.2 Mirror Configuration

> These are the core settings for Mirror storage

- **Preset Template (preset)** *Required*
  - Select the parsing template for the target mirror site
  - Options: `tuna` (Tsinghua), `ustc` (USTC), `aliyun` (Alibaba Cloud)
  - Different mirror sites have different HTML structures, requiring corresponding parsing strategies

- **Mirror Site URL (endpoint_url)** *Required*
  - The root URL of the mirror site
  - Must start with `http://` or `https://`
  - Example: `https://mirrors.tuna.tsinghua.edu.cn/`

### 3.3 Advanced Configuration

- **Enable Browser Masquerading (enable_masquerade)** (optional)
  - Default: enabled
  - When enabled, requests include real browser headers to reduce the risk of being blocked
  - Includes: dynamic User-Agent, Chromium Client Hints, random IP headers (X-Real-IP/X-Forwarded-For)

- **Max Entries (max_entries)** (optional)
  - Maximum entries returned per directory listing
  - Default: 1000
  - Large directories may cause slow parsing, consider lowering this value

- **Proxy URL (url_proxy)** (optional)
  - HTTP proxy for accessing the mirror site
  - Format: `http://proxy:port`


## 4. How It Works

### 4.1 Directory Parsing

Mirror driver parses mirror site directory pages (HTML/JSON/XML) into file lists:

```
CloudPaste                           Upstream Mirror
┌─────────────────┐                 ┌─────────────────┐
│  /ubuntu/       │ ──── GET ────→ │  HTML Directory │
│    ├── dists/   │ ←── Parse ───  │  <a href="..."> │
│    └── pool/    │                │  ...            │
└─────────────────┘                 └─────────────────┘
```

### 4.2 Parsing Strategies

Different HTML parsing strategies are used based on the `preset` configuration:

| Preset | Parsing Characteristics |
|--------|------------------------|
| `tuna` | Parses `<tr>` table rows, extracts `<a>` links and `class="date"` timestamps |
| `ustc` | Parses `<tr>` table rows, extracts `class="filetime"` timestamps and `title="bytes"` sizes |
| `aliyun` | Parses portal page pagination (auto-fetches page 2), filters DNS/NTP entries |

### 4.3 Browser Masquerading

When `enable_masquerade` is enabled, each request includes:

- **Dynamic User-Agent**: Randomly selected from 19 desktop + 4 mobile UA pool
- **Chromium Client Hints**: `Sec-CH-UA`, `Sec-CH-UA-Platform`, etc.
- **Random IP Headers**: `X-Real-IP`, `X-Forwarded-For` (only modifies headers, not actual proxy)
- **Full Browser Headers**: `Accept`, `Accept-Language`, `Referer`, etc.

> **Note**: IP masquerading only modifies HTTP request headers, upstream servers can still obtain the real IP via TCP connection.

### 4.4 Performance Protection

- **Directory page size limit**: Max 2MB per directory page
- **Entry limit**: Controlled via `max_entries` parameter (default 1000)
- **HTTP Range support**: File downloads support resume


## 5. Mount & Permissions

After saving the Mirror storage configuration, create a mount point in "Mount Management":

1. Go to **Mount Management** → New Mount
2. Select the Mirror storage configuration
3. Enter mount path (e.g., `/mirror/tuna`), notes, etc.
4. Configure options as needed:
   - **Web Proxy**: Whether to force web scenarios through CloudPaste proxy
   - **Enable Signature**: Whether to enable signature protection for proxy endpoints

The Mirror storage configuration also has an **Allow API Key Usage (is_public)** option:

- When enabled, API keys can use this storage within their mount path scope
- Combined with API key's basic_path and mount path for precise access control

For detailed mounting and permissions, see:

- [Mount Management Guide](/en/guide/mount-management)
- [Storage/Mount Common Settings](/en/guide/storage-common)


## 6. Troubleshooting

### 6.1 Connection Test Failed: HTTP 403

**Error message:**
> Upstream mirror site denied access (HTTP 403)

**Possible causes:**
- Mirror site detected abnormal request frequency, triggered rate limiting
- Browser masquerading not enabled

**Solutions:**
1. Confirm `enable_masquerade` is enabled
2. Reduce request frequency, avoid many requests in short time
3. Use `url_proxy` to configure a proxy server
4. Wait a few minutes before retrying

### 6.2 Empty Directory Listing

**Possible causes:**
- `preset` doesn't match the actual mirror site
- Mirror site updated its HTML structure

**Solutions:**
1. Confirm `preset` is correct (tuna/ustc/aliyun)
2. Confirm `endpoint_url` format is correct (includes protocol and trailing slash)
3. Access the mirror site directly in browser to confirm page is normal
4. If mirror site structure changed, please submit an Issue

### 6.3 Slow Download Speed

**Possible causes:**
- High network latency to the mirror site

**Solutions:**
1. Use **DIRECT_LINK** strategy to let clients download directly from mirror site
2. Or disable "Web Proxy" in mount configuration

### 6.4 Can I Add Other Mirror Sites?

**Answer**: Currently only three preset templates are supported (tuna/ustc/aliyun). To support other mirror sites:

1. Submit an Issue to the CloudPaste project
2. Provide the mirror site URL and directory page HTML examples
3. Wait for developers to add new parsing strategies

### 6.5 Why Read-Only?

**Explanation**: This is by design. Mirror sites are public read-only resources that don't provide upload interfaces. CloudPaste only acts as a "browser" role, parsing directory pages into file lists.


## 7. References

- [Tsinghua TUNA Mirror](https://mirrors.tuna.tsinghua.edu.cn/)
- [USTC Mirror](https://mirrors.ustc.edu.cn/)
- [Alibaba Cloud Mirror](https://mirrors.aliyun.com/)
