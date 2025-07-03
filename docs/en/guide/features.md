# Features

CloudPaste provides rich functionality to meet different users' file sharing and management needs.

## 📝 Markdown Editing & Sharing

### Powerful Editor

CloudPaste integrates the [Vditor](https://github.com/Vanessa219/vditor) editor, providing professional Markdown editing experience:

- **WYSIWYG**: Supports real-time preview and WYSIWYG editing
- **Syntax Highlighting**: Code block syntax highlighting
- **Keyboard Shortcuts**: Rich keyboard shortcuts support
- **Toolbar**: Intuitive editing toolbar

### Rich Syntax Support

- **GitHub Flavored Markdown**: Full GFM syntax support
- **Math Formulas**: LaTeX math formula rendering
- **Flowcharts**: Mermaid flowchart support
- **Mind Maps**: Mind mapping functionality
- **Tables**: Visual table editing
- **Task Lists**: Todo list support

### Secure Sharing Features

- **Password Protection**: Set access passwords for content
- **Expiration Time**: Custom content expiration time
- **Access Limits**: Limit maximum view count
- **Custom Links**: Personalized sharing links
- **Notes**: Add content notes

### Multi-format Export

- **PDF Export**: High-quality PDF documents
- **Markdown Export**: Original Markdown files
- **HTML Export**: Static HTML pages
- **PNG Export**: Image format export
- **Word Export**: Microsoft Word documents

### Convenient Sharing

- **One-click Copy**: Quick copy sharing links
- **QR Code**: Auto-generate sharing QR codes
- **Raw Links**: GitHub Raw-like direct link access
- **Auto Save**: Draft auto-save support

## 📤 File Upload & Management

### Multi-Storage Support

CloudPaste supports multiple S3-compatible storage services:

- **Cloudflare R2**: Officially recommended, cost-effective
- **Backblaze B2**: Economical storage choice
- **AWS S3**: Industry standard object storage
- **MinIO**: Self-hosted object storage service
- **Other S3-compatible services**: Supports all S3 API compatible storage

### Storage Configuration Management

- **Visual Configuration**: Intuitive storage configuration interface
- **Multiple Storage Spaces**: Support configuring multiple storage spaces
- **Flexible Switching**: Can switch default storage source at any time
- **Connection Testing**: Automatic connection testing during configuration

### Efficient Upload Mechanism

- **Presigned URLs**: Direct upload to S3 storage
- **Multi-file Upload**: Support batch file upload
- **Large File Support**: Automatic chunked upload for large files
- **Real-time Progress**: Real-time upload progress display

### File Management Features

- **Online Preview**: Preview for common documents, images, media files
- **Direct Link Generation**: Generate direct access links for files
- **Metadata Management**: File notes, passwords, expiration time
- **Access Statistics**: File access count and trend analysis
- **Batch Operations**: Batch file deletion and property modification

## 🔄 WebDAV and Mount Point Management

### WebDAV Protocol Support

- **Standard Protocol**: Complete WebDAV protocol implementation
- **Network Drive**: Support mounting as network drive
- **Third-party Clients**: Compatible with various WebDAV clients

### Mount Point Management

- **Multiple Mount Points**: Support creating multiple mount points
- **Storage Mapping**: Connect different storage services
- **Permission Control**: Fine-grained mount point access permissions
- **API Key Integration**: Authorize access through API keys

### File Operation Support

- **Complete Operations**: Create, upload, delete, rename
- **Directory Management**: Directory creation and management
- **Large File Handling**: Automatic chunked upload mechanism
- **Permission Inheritance**: Directory permission inheritance mechanism

## 🔐 Lightweight Permission Management

### Administrator Permission Control

- **System Management**: Global system settings configuration
- **Content Moderation**: Management permissions for all user content
- **Storage Management**: Complete management of S3 storage services
- **Permission Assignment**: Creation and permission management of API keys
- **Data Analysis**: Complete access to statistical data

### API Key Permission Control

- **Text Permissions**: Create/edit/delete text content
- **File Permissions**: Upload/manage/delete files
- **Storage Permissions**: Can select specific storage configurations
- **Mount Permissions**: WebDAV mount access permissions

### Security Mechanisms

- **Time Control**: Custom API key validity period
- **Automatic Expiration**: Automatic expiration mechanism when expired
- **Manual Revocation**: Revoke API keys at any time

## 💫 System Features

### User Experience

- **Responsive Design**: Perfect adaptation for mobile devices and desktop
- **Multi-language Support**: Chinese/English bilingual interface
- **Theme Switching**: Free switching between light/dark themes
- **PWA Support**: Can be used offline and installed to desktop

### Security Authentication

- **JWT Authentication**: Administrator authentication system based on JWT
- **Session Management**: Secure session management mechanism
- **Password Encryption**: Secure password storage and verification

### Performance Optimization

- **Edge Computing**: Based on Cloudflare Workers
- **Global CDN**: Cloudflare global node acceleration
- **Caching Strategy**: Intelligent caching to improve performance
- **Compressed Transmission**: Automatic compression to reduce transmission

## Next Steps

- [Quick Start](/en/guide/quick-start) - Experience these features immediately
- [Deployment Guide](/en/guide/deploy-github-actions) - Deploy your own instance
- [API Documentation](/en/api/) - Learn about API interfaces
- [Development Guide](/en/development/) - Participate in project development
