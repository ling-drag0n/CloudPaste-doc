# System Settings

CloudPaste offers a rich set of system configuration options, allowing you to customize various functionalities as needed.

## Global Settings

### File Upload Page Restrictions

Maximum upload file size: This setting only applies to the upload page; the mounted browsing page has no restrictions.

New files use proxy by default: Files uploaded via the upload page will be displayed on the file management page. If enabled, the default share link for uploaded files will be loaded via Worker proxy (or the corresponding server proxy for Docker deployments). If disabled, the default share link will point directly to the S3 storage URL.

File overwrite mode: Uploaded files are saved to the corresponding storage bucket. If enabled: Files with the same name in the bucket will be overwritten. If disabled: Files with the same name will not be overwritten; an additional identifier (e.g., `document-a1B2c3.pdf`) will be appended to the filename.

### Proxy Signature Settings

The global signature here is only effective when web proxy is enabled for the corresponding mount point in mount management. For example:
Your backend domain is `xxx`. Accessing files under the mount point can occur in several scenarios:

For the mount point:

```
Web proxy disabled: Signatures have no effect; all accessed files use direct S3 links, and traffic does not pass through the backend.

Web proxy enabled, signature disabled: All accessed files are relayed through CF, with traffic passing through the backend (CF). The corresponding preview URL is: `https://xxx/api/p/mount-point/filename`. This preview URL is permanent.

Web proxy enabled, signature enabled: Similar, but the URL takes the form `https://xxx/api/p/mount-point/filename?sign=xxxxxxxxxx&ts=1xxxx`. The preview URL expires when the signature expires. If the signature duration is 0, the URL is permanent.
```

If both the mount point and global settings specify signature durations, the override rule is: Mount point > Global settings.

## Preview Settings

### Basic File Types

Configure which file extensions can be previewed, separated by commas:

- **Text Types**: txt, md, go, tsx, log, json, etc.
- **Image Types**: jpg, jpeg, png, gif, webp, heic, etc. (supports HEIC and Live Photo - folder must contain both image and video files with the same name to trigger Live Photo)
- **Video Types**: mp4, webm, ogg, mov, etc.
- **Audio Types**: mp3, wav, m4a, flac, etc.
- **Office Types**: doc, docx, xls, xlsx, ppt, pptx (supports local rendering of docx/xlsx/pptx; others use Microsoft/Google online services or third-party services)
- **epub/mobi/azw3/fb2/cbz Types**: Support online preview for these types
- **Archive Types**: zip, rar, 7z, tar, gz, bz2, xz, tar.gz, tar.bz2, tar.xz, etc.
- **Other Types**: Including but not limited to obj (3D), xmind, dwg, dxf (CAD), etc. (requires installing third-party services to support rendering, such as KKFileView)

If you encounter files that cannot be previewed, you can add the extension at the corresponding location; as long as the browser supports it, you can preview it.

### Preview Rules Editor

> Preview rules control how specific files are previewed and which preview service is used.

**Purpose:**
- Set specialized preview methods for different files (e.g., README with Markdown preview)
- Provide multiple preview options for the same file (e.g., Office files can choose Microsoft or Google preview)
- Control rule matching order through priority

**Two Editing Modes:**

1. **Visual Mode** (recommended): Configure rules through a form interface
   - Drag to adjust rule priority
   - Expand/collapse rule cards
   - Add/remove preview services

2. **JSON Mode** (advanced): Edit JSON configuration directly

**Rule Components:**
- **Priority**: Smaller numbers have higher priority (e.g., 1 has higher priority than 10)
- **Match Condition**: File extension (e.g., `pdf,docx`) or regular expression (e.g., `/^readme$/i`)
- **Preview Type**: text, image, video, audio, pdf, office, epub, archive, iframe, download
- **Preview Service**: native (project native), microsoft (Office Online), google (Google Docs), or custom URL

**Common Scenarios:**

1. **Multiple Preview Services**: Add both Microsoft and Google preview options for Office files; users can switch during preview
2. **Special File Handling**: Allow README files without extensions to be previewed with Markdown
3. **Disable Preview**: Certain sensitive files (e.g., .key, .pem) are only allowed to download, not preview

**URL Template Variables:**

The system supports 7 template variables for replacing with actual values in preview service URLs:

| Variable | Encoding | Description | Use Case |
|----------|----------|-------------|----------|
| `$name` | No encoding | Original filename | Filename in URL path |
| `$e_name` | URL encoded | Encoded filename | Filename in query parameters |
| `$url` | No encoding | Original preview URL | Few services accept raw URL |
| `$e_url` | URL encoded | Encoded preview URL | Most common, used as query parameter |
| `$e_download_url` | URL encoded | Encoded download URL | Services that need download link |
| `$b64e_url` | Base64+URL encoded | Preview URL with Base64 then URL encoding | Services requiring Base64 format |
| `$b64e_download_url` | Base64+URL encoded | Download URL with Base64 then URL encoding | Services requiring Base64 download link |

**Usage Examples:**

Microsoft Office Online (using URL encoding):
```
https://view.officeapps.live.com/op/embed.aspx?src=$e_url
```

Google Docs Viewer (using URL encoding):
```
https://docs.google.com/viewer?url=$e_url&embedded=true
```

Custom service (requires Base64 encoding):
```
https://your-service.com/preview?file=$b64e_url
```

**KKFileView External Preview Service Tutorial:**

Official deployment tutorial: https://kkview.cn/zh-cn/docs/home.html

HuggingFace deployment (for personal use):
```dockerfile
FROM ymlisoft/kkfileview

USER root

RUN apt-get update && apt-get install -y xvfb && rm -rf /var/lib/apt/lists/*

ENV SERVER_PORT=7860
ENV KKFILEVIEW_SECURITY_TRUST_HOST=default

RUN printf '#!/bin/bash\n\
echo "=== Environment Variables ==="\n\
echo "SERVER_PORT: $SERVER_PORT"\n\
echo "KKFILEVIEW_SECURITY_TRUST_HOST: $KKFILEVIEW_SECURITY_TRUST_HOST"\n\
echo ""\n\
echo "Starting Xvfb..."\n\
Xvfb :99 -screen 0 1024x768x24 &\n\
export DISPLAY=:99\n\
sleep 2\n\
echo "Starting kkFileView on port 7860..."\n\
/opt/kkFileView/bin/kkFileView --server.port=7860\n' > /start.sh && \
chmod +x /start.sh

EXPOSE 7860

CMD ["/start.sh"]
```

After deployment, add a rule in the Preview Settings of the corresponding system settings:

- Rule ID: Fill in as desired
- Preview Type: `iframe`
- Match Extension: `Any file type supported by KKFileView (see official documentation for details)`
- Previewer List: `https://your-domain/onlinePreview?url=$b64e_url`

## Site Settings

### Site Title
Customize the site title, used for page titles and browser tabs.

### Site Icon
Customize the site icon, used for browser tabs and favicons.

### Footer Content
Customize footer content, displayed at the bottom of the page. Leave blank to hide.

### Announcement Bar
Customize announcement bar content, displayed as a pop-up on the homepage. Can be disabled.

### Custom Header
Customize the page header content, displayed at the top of the page.

Example:
<details>
<summary><b>👉 Click to expand: Custom Header Example</b></summary>

```
<!--Polyfill Support-->
<script src="https://polyfill.alicdn.com/v3/polyfill.min.js?features=String.prototype.replaceAll"></script>

<!--Font Import for Global Use-->
<link rel="stylesheet" href="https://npm.elemecdn.com/lxgw-wenkai-webfont@1.1.0/lxgwwenkai-regular.css" />

<!--Busuanzi Counter-->
<script async src="https://busuanzi.9420.ltd/js"></script>

<!--Font Awesome Icons-->
<link type="text/css" rel="stylesheet" href="https://npm.elemecdn.com/font6pro@6.3.0/css/fontawesome.min.css" media="all" />
<link href="https://npm.elemecdn.com/font6pro@6.3.0/css/all.min.css" rel="stylesheet" />

<style>
/* Set CSS Variables - This is key! */
:root {
  /* Light mode background */
  --custom-bg-light: url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  /* Dark mode background */
  --custom-bg-dark: url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  /* Surface transparency */
  --custom-surface-light: rgba(255, 255, 255, 0.5);
  --custom-surface-dark: rgba(0, 0, 0, 0.5);
  /* Text colors */
  --custom-text-light: rgb(17, 24, 39);
  --custom-text-dark: rgb(243, 244, 246);
}

/* Global font settings */
* {
  font-family: 'LXGW WenKai', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: bold !important;
}

/* Background image settings */
.bg-custom-bg-50 {
  background-image: var(--custom-bg-light) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
}

.bg-custom-bg-900 {
  background-image: var(--custom-bg-dark) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
}

/* Transparency effects */
.bg-custom-surface,
.bg-custom-surface-dark,
.card {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
}

/* Button transparency */
.btn-primary, .btn-secondary {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Input field transparency */
.form-input {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Code block transparency */
pre {
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}
</style>
```
</details>

### Custom Body
Customize the page body content. Any content set here will be automatically placed at the end of the webpage.

<details>
<summary><b>👉 Click to expand: Custom Body Example</b></summary>

```
<style>
.cloudpaste-custom-footer {
  margin-top: auto;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  text-align: center;
  font-size: 11px;
  opacity: 0.9;
}

.cloudpaste-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.cloudpaste-stats span {
  color: #60a5fa;
  font-weight: bold;
}

.hitokoto-text {
  font-style: italic;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

@media (max-width: 640px) {
  .cloudpaste-stats {
    gap: 10px;
    font-size: 10px;
  }
}
</style>

<div class="cloudpaste-custom-footer">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="hitokoto-text">
      <span id="hitokoto_text">"The greatest regret in life is meeting someone you want to protect for a lifetime when you're powerless to do so."</span>
    </div>
    <div class="cloudpaste-stats" id="busuanzi-container">
      <span>Page views: <span id="busuanzi_page_pv">-</span></span>
      <span>Total visits: <span id="busuanzi_site_pv">-</span></span>
      <span>Visitors: <span id="busuanzi_site_uv">-</span></span>
    </div>
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.6;">
      Powered by CloudPaste © 2025
    </div>
  </div>
</div>

<!-- Hitokoto API -->
<script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto_text" defer></script>

<!-- Busuanzi Counter -->
<script async src="https://busuanzi.9420.ltd/js"></script>
```
</details>

---