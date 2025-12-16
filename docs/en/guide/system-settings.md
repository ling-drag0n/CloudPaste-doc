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

### Text Types
File extensions to be previewed as text, separated by commas, e.g., `txt,md,go,tsx`.

### Audio Types
File extensions to be previewed as audio, separated by commas, e.g., `mp3,wav,m4a`.

### Video Types
File extensions to be previewed as video, separated by commas, e.g., `mp4,webm,ogg`.

### Image Types
File extensions to be previewed as images, separated by commas, for example: jpg,jpeg,png,gif,webp,heic.
Supports HEIC format and Live Photos (both an image and video file with the same name must exist in the folder to trigger Live Photos)

### Office Types

File extensions to be previewed as office documents, separated by commas, for example: doc,docx,ppt,pptx,xls,xlsx.
Currently rendered locally (only supports docx, pptx, xlsx), while others are converted through online Microsoft and Google services.

### Document Files
PDF
Currently uses the browser's native PDF preview.

If a file cannot be previewed, add its extension to the corresponding list above. As long as the browser supports it, the file can be previewed.

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