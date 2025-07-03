# Introduction

<div align="center">
    <a href="https://github.com/ling-drag0n/CloudPaste">
        <img width="50%" alt="logo" src="/images/guide/cloudpaste-github.png" />
    </a>
    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
        <a href="https://deepwiki.com/ling-drag0n/CloudPaste">
            <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki">
        </a>
        <a href="https://github.com/ling-drag0n/CloudPaste/blob/main/LICENSE">
            <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License">
        </a>
        <a href="https://github.com/ling-drag0n/CloudPaste/stargazers">
            <img src="https://img.shields.io/github/stars/ling-drag0n/CloudPaste.svg" alt="GitHub Stars">
        </a>
        <a href="https://www.cloudflare.com/">
            <img src="https://img.shields.io/badge/Powered%20by-Cloudflare-F38020?logo=cloudflare" alt="Powered by Cloudflare">
        </a>
        <a href="https://hub.docker.com/r/dragon730/cloudpaste-backend">
            <img src="https://img.shields.io/docker/pulls/dragon730/cloudpaste-backend.svg" alt="Docker Pulls">
        </a>
    </div>
</div>

CloudPaste is an open-source file sharing solution based on Cloudflare's online text/large file sharing platform. It supports multiple syntax Markdown rendering, burn after reading, S3 aggregated storage and management, password protection and other functions, can be mounted as WebDAV, and supports Docker deployment.

### Core Advantages

- **🚀 High Performance**: Based on Cloudflare Workers and D1 database, global edge computing
- **🔒 Secure & Reliable**: Supports password protection, access restrictions, JWT authentication
- **💰 Cost-Effective**: Utilizes Cloudflare free tier, almost zero-cost operation
- **🌍 Global Acceleration**: Cloudflare CDN global nodes for fast access
- **📱 Responsive Design**: Perfect adaptation for desktop and mobile devices

## Demo Screenshots

![Multi-platform Preview](/images/guide/image.png)

![Main Interface](/images/guide/image-1.png)

![Text Editor Interface](/images/guide/image-2.png)

![File Upload Interface](/images/guide/image-3.png)

<details>
    <summary>More Interface Screenshots</summary>

![Admin Console](/images/guide/image-4.png)

![System Settings](/images/guide/image-5.png)

![English Interface](/images/guide/image-en1.png)

![WebDAV Mount](/images/guide/image-mount1.png)

![File Management](/images/guide/image-mount2.png)

</details>

## Technical Architecture

### Frontend Tech Stack

- **Vue.js 3**: Modern frontend framework
- **Vite**: Fast build tool
- **TailwindCSS**: Utility-first CSS framework
- **Vditor**: Powerful Markdown editor
- **Vue-i18n**: Internationalization support

### Backend Tech Stack

- **Cloudflare Workers**: Edge computing platform
- **Hono**: Lightweight web framework
- **Cloudflare D1**: SQLite database
- **S3 API**: Compatible with multiple object storage
- **JWT**: Secure authentication

## Deployment Options

CloudPaste supports multiple deployment methods:

### Cloudflare Deployment

- **Workers**: Backend API service
- **Pages**: Frontend static website
- **D1**: Database storage
- **R2**: File storage (optional)

### Docker Deployment

- **Official Images**: Pre-built Docker images
- **Docker Compose**: One-click frontend and backend deployment
- **Custom Build**: Support custom configuration

### Other Platforms

- **Vercel**: Frontend deployment
- **ClawCloud**: Docker deployment
- **HuggingFace**: Docker deployment

## Open Source License

CloudPaste is released under the [Apache License 2.0](https://github.com/ling-drag0n/CloudPaste/blob/main/LICENSE), you can freely use, modify and distribute.

## Community Support

- **GitHub**: [https://github.com/ling-drag0n/CloudPaste](https://github.com/ling-drag0n/CloudPaste)
- **Issues**: Bug reports and feature requests

## Next Steps

- [Quick Start](/en/guide/quick-start) - Deploy CloudPaste immediately
- [Features](/en/guide/features) - Learn detailed features
- [Deployment Guide](/en/guide/deploy-github-actions) - Choose suitable deployment method
- [API Documentation](/en/api/) - Integration and development guide
