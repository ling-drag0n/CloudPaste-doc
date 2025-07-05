---
layout: home

hero:
  name: CloudPaste
  text: Online Clipboard & File Sharing
  tagline: Modern file sharing solution based on Cloudflare, supporting Markdown editing and multiple storage services
  image:
    src: /logo.png
    alt: CloudPaste Logo
    # 如果您有暗色模式的 logo，可以取消注释下面的配置
    # dark: /logo-dark.png
    # light: /logo-light.png
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/quick-start
    - theme: alt
      text: View Demo
      link: https://copy.730888.xyz/paste/demo3
    - theme: alt
      text: GitHub
      link: https://github.com/ling-drag0n/CloudPaste

features:
  - icon: 📝
    title: Markdown Editing & Sharing
    details: Integrated powerful Vditor editor with GitHub-flavored Markdown, math formulas, flowcharts, mind maps, multi-format export and secure sharing

  - icon: 📤
    title: Multi-Storage Support
    details: Compatible with various S3 storage services (Cloudflare R2, Backblaze B2, AWS S3, etc.), supports presigned URL direct upload with real-time progress

  - icon: 🛠
    title: Convenient File Operations
    details: Unified management of files and text, supports online preview, batch operations, sharing tools, short links and QR code generation

  - icon: 🔄
    title: WebDAV Support
    details: Access and manage file system through standard WebDAV protocol, supports network drive mounting and third-party clients

  - icon: 🔐
    title: Permission Management
    details: Lightweight permission control system with admin privileges and API key permissions, fine-grained access control and security mechanisms

  - icon: 💫
    title: Modern Experience
    details: Responsive design with multi-language support, dark mode, PWA offline usage, JWT-based secure authentication system
---

## 🚀 Quick Deployment

CloudPaste supports multiple deployment methods to meet different needs:

### GitHub Actions Auto Deploy

Use GitHub Actions for automatic deployment after code push, supports Cloudflare Workers and Pages.

### Docker One-Click Deploy

Official Docker images provided, supports Docker Compose one-click deployment of frontend and backend services.

### Manual Deploy

Supports manual deployment on platforms like Cloudflare Pages, Vercel, etc.

## 🔧 Tech Stack

**Frontend**

- Vue.js 3 + Vite
- TailwindCSS
- Vditor Editor
- Vue-i18n Internationalization

**Backend**

- Cloudflare Workers
- Hono Framework
- Cloudflare D1 Database
- Multi S3-compatible Storage

## 📄 Open Source License

This project is released under the [Apache License 2.0](https://github.com/ling-drag0n/CloudPaste/blob/main/LICENSE).

## ❤️ Support the Project

If this project helps you, please consider giving us a ⭐ Star!

[![Star History Chart](https://api.star-history.com/svg?repos=ling-drag0n/CloudPaste&type=Date)](https://star-history.com/#ling-drag0n/CloudPaste&Date)
