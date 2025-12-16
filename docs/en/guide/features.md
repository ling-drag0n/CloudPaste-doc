# Features

CloudPaste offers rich features to meet various file sharing and management needs from individuals to teams.

## 📝 Markdown Editing and Sharing

### Professional Editing Experience

CloudPaste integrates a powerful Markdown editor, making text creation more efficient:

- **WYSIWYG Editing**: Real-time preview of editing effects, making writing more intuitive
- **Rich Syntax Support**: Supports GitHub-style Markdown, mathematical formulas, flowcharts, mind maps, etc.
- **Code Highlighting**: Provides professional code display capabilities for programmers
- **Quick Operations**: Comprehensive keyboard shortcuts to improve creation efficiency

### Flexible Sharing Controls

Set fine-grained access controls for each text share:

- **Password Protection**: Set access passwords for sensitive content
- **Expiration Control**: Set automatic expiration time to avoid long-term exposure
- **Access Count Limit**: Limit view counts, automatically expire when reached
- **Custom Links**: Create memorable personalized sharing links

### Multi-format Export

Export to multiple formats with one click to meet different scenario needs:

- PDF, Word, HTML, PNG, raw Markdown and other formats
- Maintain consistent formatting, suitable for sharing and archiving

### Convenient Sharing Methods

- **One-click Copy Link**: Quickly share with others
- **QR Code Generation**: Convenient for mobile scanning access
- **Raw Direct Link**: Suitable for API calls and automation scenarios
- **Draft Auto-save**: Avoid accidental loss of edited content

## 📤 Flexible Storage Options

### Diverse Storage Backends

CloudPaste supports connecting to your favorite storage services, with data completely under your control:

#### Object Storage (S3 Compatible)

Connect to mainstream object storage services for cost-effectiveness and global acceleration:

- **Cloudflare R2**: Zero egress fees, officially recommended
- **Backblaze B2**: Affordable pricing, suitable for large-capacity storage
- **AWS S3**: Industry standard, global coverage
- **MinIO**: Self-hosted solution, complete control
- **Domestic Services**: Alibaba Cloud OSS, Tencent Cloud COS, Qiniu Cloud, etc.

Suitable for scenarios requiring high performance, large capacity, and global access.

#### Cloud Storage

Connect to existing cloud storage through WebDAV protocol:

- Nutstore, Alist, NextCloud and other mainstream WebDAV services
- No need to purchase additional storage, utilize existing resources

Suitable for individual users, reusing existing cloud storage space.

#### OneDrive / Google Drive

Securely connect to your cloud storage via OAuth:

- Supports personal and enterprise versions (OneDrive 21Vianet, Google Workspace)
- Auto-refresh authorization, no frequent login required
- Supports shared drives and team collaboration

Suitable for users with existing Microsoft 365 or Google Workspace subscriptions.

#### GitHub Storage

Innovatively use GitHub as a storage backend:

- **GitHub Releases**: Read-only mode, view release files of open source projects
- **GitHub API**: Read-write mode, directly operate repository files

Suitable for developers and open source projects, combining version control with file sharing.

#### Local Disk

Use server local disk in Docker or Node.js deployment environments:

- Zero cost, no third-party services required
- Completely offline available

Suitable for intranet environments or scenarios with extremely high data privacy requirements.

### Simple Configuration Management

- **Visual Configuration Interface**: No need to write configuration files, complete through forms
- **Connection Testing**: One-click test if storage works properly
- **Multiple Storage Coexistence**: Configure multiple storages, flexibly switch between them
- **Secure Encryption**: Passwords and keys are encrypted and saved in the backend to ensure security

## 📂 Powerful File Management

### Efficient Upload Experience

#### Multiple Upload Methods

- **Drag and Drop Upload**: Directly drag files to the browser
- **Batch Upload**: Select multiple files at once
- **Chunked Upload**: Large files are automatically chunked, supports resumable upload
- **Direct Upload to Storage**: Files are uploaded directly to object storage, bypassing the server (improves speed, reduces cost)

#### Real-time Progress Feedback

- Upload progress displayed in real-time
- Automatic retry on failure
- Can cancel or pause at any time

### Rich Preview Capabilities

View multiple file formats online without downloading:

#### Image Preview

- Supports common image formats (JPG, PNG, GIF, WebP, SVG, etc.)
- **EXIF Information Display**: Automatically extract camera model, aperture, shutter, ISO, focal length and other photography parameters
- **GPS Location**: Photo shooting location displayed on map, supports Google Maps and Amap links
- **Live Photo Playback**: Native playback of iPhone Live Photos

#### Multimedia Preview

- **Audio Player**: MP3, WAV, FLAC and other formats
- **Video Player**: MP4, WebM, MOV and other formats, supports dragging progress bar

#### Documents and Code

- **PDF Reader**: Smooth PDF online viewing
- **Code Highlighting**: Syntax highlighting for 100+ programming languages
- **Markdown Rendering**: Real-time rendering display effect
- **Office Documents**: Word, Excel, PowerPoint online preview

#### Archives

- View file list within archives
- Browse content without decompression

### Flexible Access Methods

CloudPaste provides three file access methods, automatically selecting the optimal solution:

- **Direct Link Access**: Files downloaded directly from storage source, fastest speed (suitable for public files)
- **Proxy Access**: Routed through CloudPaste server, supports password protection and access control
- **Custom Proxy**: Use external CDN or proxy service, balancing speed and security

The system automatically selects the most appropriate method based on storage type and permission settings.

### Fine-grained Permission Control

#### File-level Permissions

- Set access passwords for individual files
- Set file expiration time, automatically delete when expired
- Limit maximum access count

#### Directory-level Permissions

- Set unified password for entire directory
- Customize directory description (supports Markdown)
- Hide specific files (e.g., hide files starting with .)
- Subdirectories automatically inherit parent directory settings

### Convenient Batch Operations

- **Batch Upload**: Upload multiple files at once
- **Batch Delete**: Quickly clean up unwanted files
- **Batch Copy/Move**: Support cross-storage copying (background asynchronous processing, does not affect other operations)

## 🔗 WebDAV Support

### Use as Network Drive

CloudPaste fully implements the WebDAV protocol, allowing you to:

- **Windows**: Map as network drive ("Map network drive" feature)
- **macOS**: Connect to server through Finder
- **Linux**: Mount using davfs2
- **Mobile**: Use FE File Manager (iOS) or Solid Explorer (Android)

### Seamless File Operations

After connection, operate just like local folders:

- Drag and drop files for upload and download
- Create, rename, delete files and folders
- Copy and move files
- Directly open and edit files in Office and other applications

### Flexible Policy Selection

Choose WebDAV access policy based on actual needs:

- **Direct Mode**: WebDAV requests directly redirected to storage source (fast speed)
- **Proxy Mode**: All traffic passes through server (suitable for scenarios requiring unified authentication)
- **Custom Proxy**: Use external proxy service (highest flexibility)

## 🔐 Security and Permissions

### Dual Authentication System

#### Administrator Account

- Has highest system permissions
- Manage all storage configurations, files and users
- View complete statistics

#### API Keys

Create dedicated keys for different users or applications, precisely controlling permissions:

- **Text Sharing Permissions**: Create and manage text shares
- **File Sharing Permissions**: Upload and manage file shares
- **File System Permissions**: Browse, upload, copy, rename, delete files
- **WebDAV Permissions**: Access through WebDAV protocol

### Flexible Access Control

#### Path Restrictions

Limit API keys to access only specific directories, achieving multi-tenant isolation:

- Example: User A can only access the `/user-a/` directory
- Suitable for assigning independent spaces to different users

#### Storage Whitelist

Control which storages API keys can access:

- Example: Temporary keys can only access temporary storage
- Avoid accidental operations on sensitive storage

#### Time Control

- Set API key expiration time, automatically invalidates
- Manually revoke keys no longer needed at any time

### Data Security

- **Sensitive Information Encryption**: Passwords, keys and other sensitive fields are encrypted for storage
- **Hotlink Protection**: Supports signature verification to prevent unauthorized access
- **Password Hash Storage**: User passwords are securely stored and cannot be reverse-decrypted

## 💫 Modern Experience

### Cross-platform Support

#### Responsive Design

- **Mobile Optimization**: Perfect adaptation for phones and tablets
- **Desktop Enhancement**: Automatically switch to multi-column layout on large screens
- **Touch-friendly**: Supports touch gesture operations

#### PWA Progressive App

- Install to desktop or home screen, use like a native app
- Some features support offline access
- Quick startup, no need to open browser every time

### Multi-language Interface

- Supports Chinese (Simplified) and English
- One-click language switch, no page refresh needed
- All interface elements fully translated

### Themes and Personalization

- **Light Mode**: Suitable for daytime use
- **Dark Mode**: More comfortable for nighttime use
- **Auto Switch**: Follow system theme settings

### Smooth Interaction

- Immediate operation feedback (success, warning, error prompts)
- Double confirmation for dangerous operations
- Real-time display of upload/download progress
- Smooth loading animations

## ⚡ High-performance Architecture

### Edge Computing Acceleration

Deployed based on Cloudflare Workers, with nearby responses from 300+ global data centers:

- Millisecond-level response regardless of user location
- Zero cold start, instant request processing
- On-demand scaling, easily handle traffic peaks

### Smart Caching

- Directory list smart caching, reducing storage API calls
- Presigned URL caching, speeding up file access
- Manual cache clearing available to ensure data freshness

### Global CDN

- Static resources distributed through Cloudflare CDN
- Object storage comes with global acceleration
- Supports custom domains and CNAME

## 🛠️ Operations-friendly

### Flexible Deployment Methods

Choose the deployment method that suits you best:

- **Cloudflare Workers** (Recommended): Zero server maintenance, global acceleration
- **Docker**: One-click deployment, suitable for self-hosted servers
- **Node.js**: Traditional deployment method, best compatibility

### Data Backup and Recovery

#### Easy Backup

- One-click export all data (JSON format)
- Option to backup specific modules (e.g., only backup storage configurations)
- Data is readable, convenient for checking and editing

#### Flexible Recovery

- Upload backup file to restore
- Supports overwrite mode and merge mode
- Automatic data integrity verification before recovery

### Scheduled Tasks (Docker/Node Environment)

Automate daily maintenance work:

- Regularly clean expired shared content
- Automatically clean uploaded temporary files
- Regular cache cleaning
- Supports custom task extensions

::: tip Tip
Scheduled tasks feature needs to be used in Docker or Node.js environment. For Cloudflare Workers environment, please use Cron Triggers.
:::

### System Settings

Adjust system behavior through visual interface:

- **Upload Limits**: Limit file size and type
- **Proxy Signature**: Enable hotlink protection
- **Preview Settings**: Configure file preview size limits
- **Site Customization**: Customize site name, announcements, footer

## 🌐 API and Integration

### Complete REST API

All features provide API interfaces:

- Creation, query, update, deletion of text and files
- File system operations (list, upload, download, rename, etc.)
- Storage and mount configuration management
- Suitable for integration into automation tools and third-party applications

### WebDAV Protocol

Standard WebDAV protocol, compatible with mainstream clients:

- Windows Explorer
- macOS Finder
- Cyberduck, WinSCP and other third-party tools
- Mobile file managers

### Open Source and Extension

- **Active Maintenance**: Continuous updates, quick issue fixes
- **Community Support**: GitHub Issues and discussion areas
- **Extensible**: Supports secondary development and custom features

## Next Steps

Ready to experience these features?

- [Quick Start](/guide/quick-start) - 5-minute quick deployment
- [Deployment Guide](/guide/deploy-github-actions) - Detailed deployment tutorial
- [Storage Configuration](/guide/storage-common) - Connect your storage services
- [API Documentation](/api/) - Integrate into your application