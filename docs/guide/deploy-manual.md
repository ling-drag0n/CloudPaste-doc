# 更多部署方式

适合有一定基础的用户，提供完全的控制权和灵活性。

## 部署优势

- ✅ **完全控制**: 完全控制部署过程
- ✅ **深度自定义**: 可深度自定义配置
- ✅ **多平台支持**: 支持多种部署平台

## 支持平台

### Cloudflare 平台

- **Workers**: 后端 API 服务
- **Pages**: 前端静态网站
- **D1**: SQLite 数据库
- **R2**: 对象存储（可选）

### 其他平台

- **Vercel**: 前端部署
- **Netlify**: 前端部署
- **EdgeOne**: 前端部署
- **HuggingFace**: Docker 部署
- **ClawCloud**: Docker 部署

## 前期准备

### 必需工具

```bash
# 安装 Node.js (版本 18+)
node --version

# 安装 Wrangler CLI
npm install -g wrangler

# 验证安装
wrangler --version
```

### 获取源码

```bash
# 克隆仓库
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste

# 安装依赖
cd backend && npm install
cd frontend && npm install
```

## 部署架构选择

CloudPaste 提供两种手动部署架构供您选择：

### 🔄 一体化部署（推荐）

**前后端部署在同一个 Cloudflare Worker 上**

✨ **优势：**
- **前后端同源** - 无跨域问题，配置更简单
- **成本更低** - 导航请求不计费，相比分离部署节省 60%+ 成本
- **部署更简单** - 一次部署完成前后端，无需管理多个服务
- **性能更好** - 前后端在同一 Worker，响应速度更快

### 🔀 前后端分离部署

**后端部署到 Cloudflare Workers，前端部署到 Cloudflare Pages**

✨ **优势：**
- **灵活管理** - 前后端独立部署，互不影响
- **团队协作** - 前后端可由不同团队维护
- **扩展性强** - 前端可轻松切换到其他平台（如 Vercel）

---

## 🔄 一体化手动部署（推荐）

一体化部署将前后端部署到同一个 Cloudflare Worker，配置更简单，成本更低。

### 步骤 1：克隆仓库

```bash
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste
```

### 步骤 2：构建前端

```bash
cd frontend
npm install
npm run build
cd ..
```

**验证构建产物：** 确保 `frontend/dist` 目录存在且包含 `index.html`

### 步骤 3：配置后端

```bash
cd backend
npm install
npx wrangler login
```

### 步骤 4：创建 D1 数据库

```bash
npx wrangler d1 create cloudpaste-db
```

记下输出的 `database_id`（例如：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）

### 步骤 5：初始化数据库

```bash
npx wrangler d1 execute cloudpaste-db --file=./schema.sql
```

### 步骤 6：配置 wrangler.spa.toml

编辑 `backend/wrangler.spa.toml` 文件，修改数据库 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "cloudpaste-db"
database_id = "您的数据库ID"  # 替换为步骤4获取的ID
```

### 步骤 7：部署到 Cloudflare Workers

```bash
npx wrangler deploy --config wrangler.spa.toml
```

部署成功后，会显示您的应用 URL：

```
Published cloudpaste-spa (X.XX sec)
  https://cloudpaste-spa.your-account.workers.dev
```

### 部署完成！

**访问您的应用：** 打开上述 URL 即可使用 CloudPaste

**后续配置：**
1. 首次访问会自动初始化数据库
2. 使用默认管理员账户登录（用户名：`admin`，密码：`admin123`）
3. **⚠️ 立即修改默认管理员密码！**
4. 在管理员面板中配置 S3/WEBDAV 兼容存储服务
5. （可选）在 Cloudflare Dashboard 中绑定自定义域名

::: warning 重要提醒：文件上传功能配置
如果您需要使用文件上传功能，请务必先配置 S3 存储服务和跨域设置。

**👉 [立即配置 S3 存储](/guide/s3-config)**

特别注意 Cloudflare R2 的跨域配置，这是用户最容易忽略的步骤！
:::

---

## 🔀 前后端分离手动部署

如果您需要前后端独立部署和管理，可以选择分离部署方式。

### 1. 配置 Wrangler

```bash
# 登录 Cloudflare
wrangler auth login

# 验证登录状态
wrangler whoami
```

### 2. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create cloudpaste-db

# 记录数据库 ID，用于后续配置
```

### 3. 配置后端

编辑 `backend/wrangler.toml`：

```toml
name = "cloudpaste-backend"
main = "worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cloudpaste-db"
database_id = "your-database-id"  # 替换为实际的数据库 ID

[vars]
NODE_ENV = "production"
ENCRYPTION_SECRET = "your-encryption-secret"  # 替换为您的加密密钥
```

### 4. 初始化数据库

```bash
cd backend

# 执行数据库迁移
wrangler d1 execute cloudpaste-db --file=./schema.sql
```

### 5. 部署后端

```bash
# 部署 Worker
wrangler deploy

# 记录 Worker URL，用于前端配置
```

### 6. 配置前端

编辑 `frontend/.env.production`：

```bash
VITE_BACKEND_URL=https://your-worker-url.workers.dev
VITE_APP_ENV=production
```

### 7. 构建前端

```bash
cd frontend

# 构建生产版本
npm run build
```

### 8. 部署前端到 Cloudflare Pages

```bash
# 创建 Pages 项目
wrangler pages project create cloudpaste-frontend

# 部署到 Pages
wrangler pages deploy dist --project-name=cloudpaste-frontend
```

::: warning 重要提醒：文件上传功能配置
Cloudflare 部署完成后，如果您需要使用文件上传功能，请务必先配置 S3 存储服务和跨域设置。

**👉 [立即配置 S3 存储](/guide/s3-config)**

特别注意 Cloudflare R2 的跨域配置，这是用户最容易忽略的步骤！
:::

## Vercel 前端部署

### 前端部署到 Vercel

1. **连接 GitHub 仓库**

   - 登录 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择 CloudPaste 仓库

2. **配置构建设置**

   ```
   Framework Preset（框架预设）: Vite
   Build Command（构建命令）: npm run build
   Output Directory（输出目录）: dist
   Install Command（安装命令）: npm install
   ```

3. **配置环境变量**

   ```
   VITE_BACKEND_URL=https://your-backend-url
   ```

4. **部署**
   - 点击 "Deploy" 开始部署
   - 等待构建完成

::: warning 重要提醒：文件上传功能配置
Vercel 前端部署完成后，如果您需要使用文件上传功能，请务必先配置 S3 存储服务和跨域设置。

**👉 [立即配置 S3 存储](/guide/s3-config)**
:::

### 后端部署到 Cloudflare Workers

后端仍然推荐部署到 Cloudflare Workers，按照上述 Cloudflare 部署步骤进行。

## ClawCloud Docker 部署

### 每月 10G 免费流量，只适合轻度使用

#### Step 1:

注册链接：[Claw Cloud](https://ap-northeast-1.run.claw.cloud/signin) （不带#AFF）
不需要信用卡，只要 GitHub 注册日期大于 180 天，每个月都送 5 美金额度。

#### Step 2:

注册后，在首页点击 APP Launchpad 进入，然后点击右上角的 create app

![image.png](https://s2.loli.net/2025/04/21/soj5eWMhxTg1VFt.png)

#### Step 3:

先是部署后端，如图所示（仅供参考）：
![image.png](https://s2.loli.net/2025/04/21/AHrMnuVyNhK6eUk.png)

后端的数据存储就是这里：
![image.png](https://s2.loli.net/2025/04/21/ANaoU5Y6cxPOVfw.png)

#### Step 4:

然后是前端，如图所示（仅供参考）：
![image.png](https://s2.loli.net/2025/04/21/kaT5Qu8ctovFdUp.png)

#### Step 5:

部署完成即可使用，可根据需要自定义域名

## 自定义域名配置

### Cloudflare Workers 自定义域名

1. 在 Cloudflare Workers 控制台中选择您的 Worker
2. 进入 "Settings" → "Triggers"
3. 点击 "Add Custom Domain"
4. 输入您的域名并保存

### Cloudflare Pages 自定义域名

1. 在 Cloudflare Pages 控制台中选择您的项目
2. 进入 "Custom domains"
3. 点击 "Set up a custom domain"
4. 输入您的域名并按照指引配置

## 下一步

- [配置 S3 存储](/guide/s3-config)
- [设置 WebDAV](/guide/webdav)
- [查看 API 文档](/api/)
- [了解开发指南](/development/)
