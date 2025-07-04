---
layout: home

hero:
  name: CloudPaste
  text: 在线剪贴板和文件分享服务
  tagline: 基于 Cloudflare 的现代化文件分享解决方案，支持 Markdown 编辑和多种存储服务
  image:
    src: /logo.png
    alt: CloudPaste Logo
    # 如果您有暗色模式的 logo，可以取消注释下面的配置
    # dark: /logo-dark.png
    # light: /logo-light.png
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 查看演示
      link: https://copy.730888.xyz/paste/demo3
    - theme: alt
      text: GitHub
      link: https://github.com/ling-drag0n/CloudPaste

features:
  - icon: 📝
    title: Markdown 编辑与分享
    details: 集成强大的 Vditor 编辑器，支持 GitHub 风格的 Markdown、数学公式、流程图、思维导图等，支持多格式导出和安全分享

  - icon: 📤
    title: 多存储支持
    details: 兼容多种 S3 存储服务（Cloudflare R2、Backblaze B2、AWS S3 等），支持预签名 URL 直接上传，实时进度显示

  - icon: 🛠
    title: 便捷的文件操作
    details: 统一管理文件和文本，支持在线预览、批量操作、分享工具，生成短链接和二维码

  - icon: 🔄
    title: WebDAV 支持
    details: 通过标准 WebDAV 协议访问和管理文件系统，支持网络驱动器挂载和第三方客户端

  - icon: 🔐
    title: 权限管理
    details: 轻量级权限控制系统，支持管理员权限和 API 密钥权限，精细的访问控制和安全机制

  - icon: 💫
    title: 现代化体验
    details: 响应式设计，支持多语言、深色模式、PWA 离线使用，基于 JWT 的安全认证系统
---

## 🚀 快速部署

CloudPaste 支持多种部署方式，满足不同需求：

### GitHub Actions 自动部署

使用 GitHub Actions 实现代码推送后自动部署，支持 Cloudflare Workers 和 Pages。

### Docker 一键部署

提供官方 Docker 镜像，支持 Docker Compose 一键部署前后端服务。

### 手动部署

支持 Cloudflare Pages、Vercel 等平台的手动部署。

## 🔧 技术栈

**前端**

- Vue.js 3 + Vite
- TailwindCSS
- Vditor 编辑器
- Vue-i18n 国际化

**后端**

- Cloudflare Workers
- Hono 框架
- Cloudflare D1 数据库
- 多种 S3 兼容存储

## 📄 开源许可证

本项目基于 [Apache License 2.0](https://github.com/ling-drag0n/CloudPaste/blob/main/LICENSE) 许可证发布。

## ❤️ 支持项目

如果这个项目对您有帮助，请考虑给我们一个 ⭐ Star！

[![Star History Chart](https://api.star-history.com/svg?repos=ling-drag0n/CloudPaste&type=Date)](https://star-history.com/#ling-drag0n/CloudPaste&Date)
