# Storage / Mount Common Settings

This page explains **Custom HOST/CDN domain**, **Proxy URL** in storage config, and **Web Proxy, signing, WebDAV policy** in mount config, together with [Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js).

## 1. Custom HOST / CDN Domain (custom_host)

> Admin Panel → Storage Config → Edit → “Advanced Settings” → **Custom HOST/CDN Domain**

### What it is

- A **custom domain / CDN domain** that points to your object storage, for example: `https://cdn.example.com`

### What changes when it is set

- When this storage supports “direct link”, CloudPaste will use this domain for direct links:
  - Empty: `https://s3.xxx.com/bucket/path/file.ext`
  - Set: `https://cdn.example.com/path/file.ext`
- It only affects **direct access** (public files, embedding in other sites), and **does not change Proxy URL / WebDAV policy**.

### How to use

- You can refer to [B2 storage + reverse proxy](/en/guide/s3-config#reverse-proxy-for-private-b2-buckets-via-worker) as an example scenario.



## 2. Proxy URL (url_proxy)

> Admin Panel → Storage Config → Edit → “Advanced Settings” → **Proxy URL**

### What it is

- A domain that points to your **edge proxy service**, for example: `https://proxy.example.com`
- Typically your deployed **[Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js) (Cloudflare Worker / other edge runtime)**.

### What changes when it is set

- For this storage, the **final entry URL** will prefer this domain instead of the CloudPaste backend:
  - FS mounts: generate URLs like  
    `https://proxy.example.com/proxy/fs/<path>?sign=...`
  - Share files: generate URLs like  
    `https://proxy.example.com/proxy/share/<slug>`
- When the WebDAV policy is `use_proxy_url`, WebDAV downloads will also redirect to this domain.

### Difference from custom_host

- `custom_host`: for **direct links**. Browsers or other sites access storage/CDN directly.
- `url_proxy`: for **proxy entry**. Requests go to your proxy first, then the proxy talks to CloudPaste/storage.

Quick rules:

- Optional: only have CDN → set **Custom HOST/CDN domain** (currently S3 only);
- Optional: have your own Worker / reverse proxy → set **Proxy URL** (when you need a reverse proxy entry);
- Not sure about both → leave them empty, everything still works fine.



## 3. Web Proxy on Mount (web_proxy)

> Admin Panel → Mount Management → Edit Mount → **Web Proxy**

### What it is

- Controls how file links are generated for this mount in **web scenarios** (file manager, preview, download):
  - Whether to force going through CloudPaste’s `/api/p` local proxy;
  - Also decides whether the storage-level **Proxy URL (url_proxy)** takes effect for FS external links under this mount.

### When disabled (default)

- Do not force local proxy, combine **direct-link capability + url_proxy** to decide:

  - Case A: storage **does not** have a Proxy URL (url_proxy)  
    - Has direct-link capability → prefer direct link (custom_host / presigned URL);  
    - No direct-link capability → fall back to CloudPaste `/api/p/...` local proxy.

  - Case B: storage **has** a Proxy URL (url_proxy)  
    - The browser will always see URLs like `https://proxy.example.com/proxy/fs/...`;  
    - Whether the proxy finally uses a direct link or `/api/p` is handled inside the proxy via `/api/proxy/link`.

> In short: when **web_proxy is OFF** and you configured a Proxy URL, web links prefer the proxy entry; when Proxy URL is empty, it behaves like “direct-link if possible, otherwise fall back to local proxy”.

### When enabled

- All web access under this mount will **force using CloudPaste local proxy**:
  - Web links are always based on the CloudPaste backend domain (`/api/p/...`), **no longer rewritten to the url_proxy domain**;
  - The storage-level **Proxy URL (url_proxy)** is ignored for FS external links, and only used internally by the `/api/proxy/link` protocol for Cloudpaste-Proxy.

### When to use it

- If you don’t have a special requirement, **keep it disabled**.



## 4. Signed Access (global + per-mount enable_sign)

> Admin Panel → Mount Management → Edit Mount → **Enable Signing / Signature TTL**  
> Admin Panel → System Settings → **Proxy / Signing (global configuration)**

### What problem it solves

- Add a `?sign=...` parameter to proxy URLs, which contains **path + expiry time**;
- After signature expires or is tampered with, the URL cannot be used even if leaked.

### Three levels

1. **Global “sign all”**: turn on signing for all proxy-capable mounts;
2. **Per-mount “Enable signing”**: enable signing only for selected mounts, or override global TTL;
3. **Expiry time**:
   - `0` = never expires (not recommended for public internet);
   - Other values = seconds from generation time, after which the signature is invalid.

### Relation to secrets

- `ENCRYPTION_SECRET` in backend `.env` is the signing key;
- `SIGN_SECRET` in Cloudpaste-Proxy.js must match it, so the edge proxy can validate `sign`  
  (it does **not** affect the share page itself, only the proxy chain).

### Recommendation

- For public download sites:
  - Enable **signing**, set expiry to 10–60 minutes;
  - This protects against long-term leakage without expiring too frequently for normal users.



## 5. WebDAV Policy (webdav_policy)

> Admin Panel → Mount Management → Edit Mount → **WebDAV Policy**

WebDAV downloads support three modes, deciding **where the file is actually fetched from**.

### 5.1 `native_proxy` (default, recommended)

- All WebDAV read/write goes through CloudPaste’s own proxy:
  - Does not expose S3/CDN domains;
  - Usually works best with various WebDAV clients.
- Cost: traffic is counted on the CloudPaste side.

> For most users: **keep `native_proxy` as default**.

### 5.2 `302_redirect` (direct-link redirect)

- CloudPaste tries to ask the driver for a direct link, then returns **HTTP 302** to that URL:
  - If storage supports direct link and Web Proxy is not forced → usually redirects to S3/CDN;
  - In some combinations it may still redirect to `/api/p/...` proxy URLs.
- Pros: large files can be offloaded to storage/CDN directly;
- Note: some WebDAV clients do not handle 302 well, test with your client.

### 5.3 `use_proxy_url` (via Proxy URL / Worker)

- WebDAV also uses the **Proxy URL** to access files:
  - CloudPaste first generates `https://proxy.example.com/proxy/fs/...`;  
  - Then responds to the client with HTTP 302 to this URL.
- Requirements:
  - The storage config has a **Proxy URL** set;
  - Cloudpaste-Proxy.js is deployed and accessible.
- If URL generation fails, WebDAV will automatically fall back to `native_proxy`.



## 6. Cloudpaste-Proxy.js in a Nutshell

> File location: repo root `Cloudpaste-Proxy.js`

### What it does

- Provides two unified proxy entries:
  - `GET /proxy/fs/<path>?sign=...`: FS file access;
  - `GET /proxy/share/<slug>`: share file access.
- Internal flow (simplified):
  1. Validate `sign` (if signing is enabled);
  2. Call CloudPaste backend `/api/proxy/link` to get the real upstream URL and headers;
  3. Issue the upstream request at the edge, and stream the response back to the client, handling CORS and redirects.

### Required configuration

```js
let ORIGIN = "https://cloudpaste-backend.example.com"; // CloudPaste backend URL
let TOKEN = "ApiKey xxx";                              // Dedicated API key (full header value)
let SIGN_SECRET = "your-encryption-key";               // Must match ENCRYPTION_SECRET
let WORKER_BASE = "https://proxy.example.com";         // Public URL of this Worker
```

> **CloudPaste** decides “how to access”, **Cloudpaste-Proxy.js** helps “where to access from” (edge).



## 7. Recommended Combinations

> These are examples, not the only valid options.

### Scenario 1: Personal / intranet usage (simplest)

- Storage config:
  - Only fill required fields (endpoint, bucket, etc.);
  - Leave `custom_host` and `url_proxy` empty.
- Mount:
  - Web Proxy: off;
  - Signing: off;
  - WebDAV policy: `native_proxy`.

### Scenario 2: Public static assets (CDN direct link, S3 only)

- Storage config:
  - Set `custom_host = https://cdn.example.com`;
  - Leave Proxy URL empty.
- Mount:
  - Web Proxy: off (front-end will copy CDN direct links);
  - Signing: on/off as needed;
  - WebDAV policy: `native_proxy` or `302_redirect`, depending on your client behavior.

### Scenario 3: Hide origin + time-limited access (good for download sites)

- Storage config:
  - Set Proxy URL: `https://proxy.example.com`;
  - `custom_host` optional (for internal usage).
- Deploy Cloudpaste-Proxy.js and configure ORIGIN / TOKEN / SIGN_SECRET / WORKER_BASE.
- Mount:
  - Web Proxy: on;
  - Signing: on, signature TTL 600–3600 seconds;
  - If you also want WebDAV to go via proxy, set WebDAV policy to `use_proxy_url`.

> If you’re not sure what to choose, start with **Scenario 1**, get the system running, then gradually introduce Proxy URL and signing as needed.

