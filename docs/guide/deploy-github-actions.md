# GitHub Actions 自动部署

GitHub Actions 是最推荐的部署方式，可以实现代码推送后自动部署，完全免费且高效。

## 部署优势

- ✅ **完全免费**: 利用 Cloudflare 和 GitHub 的免费额度
- ✅ **自动化**: 推送代码即可自动部署
- ✅ **全球加速**: Cloudflare CDN 全球节点
- ✅ **高可用**: 99.9% 的服务可用性
- ✅ **HTTPS**: 自动 HTTPS 证书

## 前期准备

### 1. 获取 Cloudflare API 信息

#### API Token

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 创建新的 API 令牌
3. 选择"编辑 Cloudflare Workers"模板，并添加 D1 数据库编辑权限

   ![D1](/images/guide/D1.png)

#### Account ID

在 Cloudflare 仪表板右侧边栏可以找到您的 Account ID。

### 2. Fork 项目仓库

访问 [CloudPaste 仓库](https://github.com/ling-drag0n/CloudPaste) 并点击 Fork 按钮。

## 配置步骤

### 1. 配置 GitHub Secrets

在您 Fork 的仓库中，进入 `Settings` → `Secrets and variables` → `Actions`，添加以下 Secrets：

| Secret 名称             | 必需 | 说明                             |
| ----------------------- | ---- | -------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | ✅   | Cloudflare API 令牌              |
| `CLOUDFLARE_ACCOUNT_ID` | ✅   | Cloudflare 账户 ID               |
| `ENCRYPTION_SECRET`     | ❌   | 加密密钥（可选，系统会自动生成） |

### 2. 运行后端部署工作流

1. 进入 `Actions` 标签页
2. 选择 "Deploy Backend" 工作流
3. 点击 "Run workflow"
4. 等待部署完成

工作流会自动：

- 创建 D1 数据库
- 初始化数据库结构
- 部署 Worker 到 Cloudflare
- 设置环境变量

### 3. 配置自定义域名（推荐）

为了在国内正常访问，建议配置自定义域名：

1. 在 Cloudflare Workers 控制台找到您的 Worker
2. 点击 "Settings" → "Triggers"
3. 添加自定义域名
4. 记录后端域名，后续配置前端时需要

### 4. 运行前端部署工作流

1. 选择 "Deploy Frontend" 工作流
2. 点击 "Run workflow"
3. 等待部署完成

### 5. 配置前端环境变量

前端部署完成后，需要配置后端 API 地址：

1. 进入 Cloudflare Pages 控制台
2. 找到您的项目（通常名为 `cloudpaste-frontend`）
3. 进入 `Settings` → `Environment variables`
4. 添加环境变量：
   - **名称**: `VITE_BACKEND_URL`
   - **值**: 您的后端 Worker URL（如 `https://cloudpaste-backend.your-username.workers.dev`）

![page1](/images/guide/test-1.png)

::: warning 重要提示
环境变量值必须是完整的 URL，包含 `https://` 前缀，末尾不要添加 `/`
:::

### 6. 重新部署前端

配置环境变量后，需要重新运行前端工作流以使配置生效。

## 验证部署

### 1. 检查后端服务

访问您的后端 URL，应该看到 API 响应：

```bash
curl https://your-backend-url.workers.dev/api/health
```

### 2. 检查前端服务

访问您的前端 URL，应该看到 CloudPaste 界面。

### 3. 测试功能

1. 使用默认管理员账号登录：
   - 用户名: `admin`
   - 密码: `admin123`
2. 创建测试文本
3. 上传测试文件

::: warning 重要提醒：文件上传功能配置
如果您需要使用文件上传功能，请务必先配置 S3 存储服务和跨域设置，否则文件上传会失败。

**👉 [立即配置 S3 存储](/guide/s3-config)**

特别注意：

- Cloudflare R2 需要配置 CORS 跨域规则
- 其他 S3 服务也需要相应的跨域配置
- 配置完成后才能正常上传文件
  :::

## 常见问题

### 部署失败

**问题**: GitHub Actions 工作流失败
**解决方案**:

1. 检查 API Token 权限是否正确
2. 确认 Account ID 是否正确
3. 查看工作流日志获取详细错误信息

### 前端无法连接后端

**问题**: 前端显示网络错误
**解决方案**:

1. 确认后端 URL 配置正确
2. 检查后端服务是否正常运行
3. 确认环境变量配置正确

### 国内访问问题

**问题**: 在国内无法访问 `.workers.dev` 域名
**解决方案**:

1. 配置自定义域名
2. 使用国内 CDN 服务
3. 考虑使用 Docker 部署

## 自动更新

配置完成后，每次推送代码到 `main` 分支时，相关服务会自动更新：

- 修改 `backend/` 目录下的文件会触发后端部署
- 修改 `frontend/` 目录下的文件会触发前端部署

## 下一步

- [配置 S3 存储](/guide/s3-config)
- [设置 WebDAV](/guide/webdav)
- [查看 API 文档](/api/)
- [了解开发指南](/development/)
