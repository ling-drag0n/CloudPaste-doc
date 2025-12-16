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

CloudPaste 是一个现代化的文件分享和内容管理平台,让你轻松分享文本和文件,就像使用网盘一样简单。

无论是快速分享一段代码、一篇文章,还是管理团队的文件资源,CloudPaste 都能满足你的需求。它不仅是一个剪贴板工具,更是一个功能完整的文件管理系统。

## 为什么选择 CloudPaste?

### 🎯 简单易用

- **5 分钟部署**:无需复杂配置,使用 GitHub Actions 自动部署到 Cloudflare
- **直观界面**:现代化设计,无论是创建分享还是管理文件都非常直观
- **多端适配**:桌面、平板、手机都能完美使用
- **中英双语**:界面支持中英文切换,满足不同用户需求

### 💪 功能强大

- **专业 Markdown 编辑器**:实时预览、语法高亮、数学公式、流程图支持
- **灵活的访问控制**:密码保护、有效期设置、访问次数限制
- **多种存储选择**:支持 S3、OneDrive、Google Drive、WebDAV、GitHub、本地存储等
- **WebDAV 协议**:可以像网络驱动器一样挂载使用
- **丰富的预览**:图片、视频、音频、PDF、代码、Office 文档在线预览

### 🚀 性能卓越

- **全球加速**:基于 Cloudflare 边缘计算,全球 300+ 数据中心就近响应
- **零冷启动**:不同于传统服务器,请求瞬间处理
- **智能缓存**:自动优化访问速度,减少不必要的请求
- **大文件支持**:分片上传、断点续传,轻松处理大文件

### 💰 成本友好

- **Cloudflare 免费额度**:充分利用 Cloudflare 慷慨的免费额度
- **自选存储**:可以使用现有的云存储服务,无需额外购买
- **按需付费**:只为实际使用的资源付费,没有固定成本
- **完全开源**:代码透明,可自行部署,无厂商锁定

### 🔒 安全可控

- **数据自主**:文件存储在你自己选择的服务中,完全掌控
- **加密存储**:敏感信息加密保存,安全可靠
- **权限管理**:精细的权限控制,支持多用户协作
- **审计日志**:完整的操作记录,便于追踪管理

## 适用场景

### 👨‍💻 开发者

- **代码分享**:快速分享代码片段,支持 100+ 语言高亮
- **技术文档**:用 Markdown 编写技术文档,一键分享
- **API 集成**:提供完整 REST API,轻松集成到工具链
- **版本控制**:可使用 GitHub 作为存储,天然支持版本管理

### 📝 内容创作者

- **文章发布**:所见即所得的 Markdown 编辑器,专注创作
- **多格式导出**:一键导出为 PDF、Word、HTML、图片
- **素材管理**:集中管理图片、视频等创作素材
- **分享控制**:灵活设置访问权限,保护原创内容

### 👥 团队协作

- **文件共享**:团队成员共享文件,权限精确控制
- **WebDAV 挂载**:像网络驱动器一样使用,操作更便捷
- **多存储整合**:统一管理不同存储服务中的文件
- **访问统计**:了解文件访问情况,优化资源配置

### 🏢 企业用户

- **私有部署**:Docker 部署到内网,数据不出企业
- **多租户隔离**:通过权限系统实现多用户独立空间
- **API 密钥管理**:为不同应用分配独立密钥
- **审计合规**:完整的操作日志,满足合规要求

## 效果展示

### 多端响应式体验

无论你使用桌面电脑、平板还是手机,CloudPaste 都能提供流畅的使用体验。

![多端预览](/images/guide/image.png)

### 文件管理界面

清晰直观的文件浏览器,支持上传、下载、预览、分享等操作。

![主界面](/images/guide/image-1.png)

### Markdown 编辑器

专业的编辑体验,实时预览,让创作更高效。

![文本编辑界面](/images/guide/image-2.png)

### 文件上传

支持拖拽上传、批量上传,实时显示进度。

![文件上传界面](/images/guide/image-3.png)

<details>
    <summary>查看更多界面</summary>

![管理控制台](/images/guide/image-4.png)


![系统设置](/images/guide/image-5.png)


![英文界面](/images/guide/image-en1.png)


![WebDAV 挂载](/images/guide/image-mount1.png)


![文件管理](/images/guide/image-mount2.png)

</details>

## 技术优势

### 现代化架构

CloudPaste 采用前后端分离架构,前端使用 Vue.js 3 + Vite 构建,后端基于 Cloudflare Workers 边缘计算平台,充分利用现代 Web 技术的优势。

### 无服务器设计

基于 Cloudflare Workers 的无服务器架构,无需关心服务器运维,自动扩展,按需计费,让你专注于内容本身而非基础设施。

### 全球边缘网络

借助 Cloudflare 的全球 CDN 网络,CloudPaste 在全球各地都能提供快速响应,无论用户在哪里,都能获得良好的访问体验。

### 灵活的存储

支持连接多种存储服务,你可以使用现有的云存储(如 OneDrive、Google Drive),也可以选择对象存储(如 R2、S3),甚至可以使用本地磁盘或 GitHub 仓库。

### 开放的 API

提供完整的 REST API,支持标准的 WebDAV 协议,可以轻松集成到现有系统或自动化工具中。

## 部署方式

CloudPaste 提供多种灵活的部署方案,你可以根据自己的需求选择:

### Cloudflare 部署 (推荐)

最简单、最经济的部署方式,充分利用 Cloudflare 的免费额度:

- **零服务器维护**:无需管理服务器,Cloudflare 自动处理一切
- **全球加速**:自动部署到全球边缘网络
- **免费额度充足**:每天 100,000 次请求完全免费
- **5 分钟部署**:使用 GitHub Actions 自动化部署

适合个人用户和小型团队快速上手。

### Docker 部署

适合需要私有部署或对数据隐私有特殊要求的场景:

- **完全离线运行**:可在内网环境部署
- **数据完全自主**:所有数据保存在自己的服务器
- **一键启动**:使用 Docker Compose 快速部署
- **灵活定制**:可根据需求调整配置

适合企业用户和需要私有部署的场景。

### 其他平台

CloudPaste 也支持部署到 Vercel、Railway、Render 等其他平台,满足不同用户的需求。

## 开源与社区

CloudPaste 基于 Apache License 2.0 开源协议发布,这意味着:

- **完全免费**:个人和商业使用都无需付费
- **代码透明**:所有代码公开,可自行审计
- **自由修改**:可根据需求定制功能
- **社区驱动**:欢迎贡献代码和反馈建议

项目地址:[https://github.com/ling-drag0n/CloudPaste](https://github.com/ling-drag0n/CloudPaste)

## 开始使用

准备好体验 CloudPaste 了吗?

- **[快速开始](/guide/quick-start)** - 5 分钟完成部署
- **[功能特点](/guide/features)** - 了解所有功能
- **[部署指南](/guide/deploy-github-actions)** - 选择适合的部署方式
- **[配置存储](/guide/storage-common)** - 连接你的存储服务

如果你有任何问题或建议,欢迎在 GitHub 上提交 Issue 或 Pull Request。我们期待你的反馈!
