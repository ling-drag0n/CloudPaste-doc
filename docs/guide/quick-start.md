# 快速开始

本指南将帮助您快速部署和使用 CloudPaste。

## 前期准备

::: tip 选择部署方式
根据您的需求选择合适的部署方式：

- **[GitHub Actions 部署](/guide/deploy-github-actions)** - 推荐方式，完全免费且自动化
- **[Docker 部署](/guide/deploy-docker)** - 适合有服务器的用户，支持本地存储
- **[更多部署方式](/guide/deploy-manual)** - 包含 Cloudflare、Vercel 等多种平台的手动部署方法
  :::

在开始部署前，请确保您已准备以下内容：

- [x] [Cloudflare](https://dash.cloudflare.com) 账号 / VPS (docker)
- [x] 如使用 R2：需要开通 **Cloudflare R2** 服务并创建存储桶（需绑定支付方式）
- [x] 如使用 B2：直接注册 [Backblaze](https://www.backblaze.com) 账号并创建应用密钥
- [x] 如使用 Vercel：注册 [Vercel](https://vercel.com) 账号
- [x] 其他 S3 存储服务的配置信息：
  - `S3_ACCESS_KEY_ID`
  - `S3_SECRET_ACCESS_KEY`
  - `S3_BUCKET_NAME`
  - `S3_ENDPOINT`

## 初始配置

部署完成后，请按以下步骤进行初始配置：

### 1. 访问管理界面

使用默认管理员账号登录：

- **用户名**: `admin`
- **密码**: `admin123`

::: warning 安全提示
请在系统初始化后立即修改默认管理员密码！
:::

### 2. 配置存储服务

在管理界面中配置您的 S3 存储服务：

1. 进入 "S3 存储配置"
2. 点击 "添加存储配置"
3. 填入存储服务信息
4. 测试连接并保存

### 3. 创建 API 密钥（可选）

如需使用 API 或 WebDAV 功能：

1. 进入 "API 密钥管理"
2. 创建新的 API 密钥
3. 设置相应权限
4. 保存密钥信息

## 基本使用

### 文本分享

1. 在首页点击 "创建文本"
2. 使用 Markdown 编辑器编写内容
3. 设置访问权限（可选）
4. 点击 "保存并分享"

### 文件上传

1. 在首页点击 "上传文件"
2. 选择或拖拽文件
3. 设置文件属性（可选）
4. 开始上传

### WebDAV 挂载

1. 获取 WebDAV 地址：`https://your-domain/dav` （后端域名作为地址）
2. 使用管理员账号或 API 密钥认证
3. 在文件管理器中添加网络位置

## 下一步

- 了解更多 [功能特点](/guide/features)
- 查看详细部署指南：
  - [GitHub Actions 部署](/guide/deploy-github-actions)
  - [Docker 部署](/guide/deploy-docker)
  - [手动部署](/guide/deploy-manual)
- 阅读 [API 文档](/api/)
- 参与 [开发贡献](/development/)
