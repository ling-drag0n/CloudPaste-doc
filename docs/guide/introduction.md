# 介绍

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

CloudPaste 是一个开源的文件分享解决方案，基于 Cloudflare 的在线文本/大文件分享平台。支持多种语法 Markdown 渲染、阅后即焚、S3聚合存储与管理、密码保护等功能，可作为WebDav挂载，支持Docker部署。

### 核心优势

- **🚀 高性能**: 基于 Cloudflare Workers 和 D1 数据库，全球边缘计算
- **🔒 安全可靠**: 支持密码保护、访问限制、JWT 认证
- **💰 成本低廉**: 利用 Cloudflare 免费额度，几乎零成本运行
- **🌍 全球加速**: Cloudflare CDN 全球节点，访问速度快
- **📱 响应式设计**: 完美适配桌面和移动设备

## 效果展示

![多端预览](/images/guide/image.png)

![主界面](/images/guide/image-1.png)

![文本编辑界面](/images/guide/image-2.png)

![文件上传界面](/images/guide/image-3.png)

<details>
    <summary>更多界面展示</summary>

![管理控制台](/images/guide/image-4.png)

![系统设置](/images/guide/image-5.png)

![英文界面](/images/guide/image-en1.png)

![WebDAV 挂载](/images/guide/image-mount1.png)

![文件管理](/images/guide/image-mount2.png)

</details>

## 技术架构

### 前端技术栈

- **Vue.js 3**: 现代化的前端框架
- **Vite**: 快速的构建工具
- **TailwindCSS**: 实用优先的 CSS 框架
- **Vditor**: 强大的 Markdown 编辑器
- **Vue-i18n**: 国际化支持

### 后端技术栈

- **Cloudflare Workers**: 边缘计算平台
- **Hono**: 轻量级 Web 框架
- **Cloudflare D1**: SQLite 数据库
- **S3 API**: 兼容多种对象存储
- **JWT**: 安全的身份认证

## 部署选项

CloudPaste 支持多种部署方式：

### Cloudflare 部署

- **Workers**: 后端 API 服务
- **Pages**: 前端静态网站
- **D1**: 数据库存储
- **R2**: 文件存储（可选）

### Docker 部署

- **官方镜像**: 预构建的 Docker 镜像
- **Docker Compose**: 一键部署前后端
- **自定义构建**: 支持自定义配置

### 其他平台

- **Vercel**: 前端部署
- **ClawCloud**: Docker 部署
- **HuggingFace**: Docker 部署

## 开源协议

CloudPaste 基于 [Apache License 2.0](https://github.com/ling-drag0n/CloudPaste/blob/main/LICENSE) 开源协议发布，您可以自由使用、修改和分发。

## 社区支持

- **GitHub**: [https://github.com/ling-drag0n/CloudPaste](https://github.com/ling-drag0n/CloudPaste)
- **Issues**: 问题反馈和功能请求

## 下一步

- [快速开始](/guide/quick-start) - 立即部署 CloudPaste
- [功能特点](/guide/features) - 了解详细功能
- [部署指南](/guide/deploy-github-actions) - 选择适合的部署方式
- [API 文档](/api/) - 集成和开发指南
