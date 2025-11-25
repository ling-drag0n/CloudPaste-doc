# GitHub Actions 自动部署

GitHub Actions 是最推荐的部署方式，可以实现代码推送后自动部署，完全免费且高效。

## 部署优势

- ✅ **完全免费**: 利用 Cloudflare 和 GitHub 的免费额度
- ✅ **自动化**: 推送代码即可自动部署
- ✅ **全球加速**: Cloudflare CDN 全球节点
- ✅ **高可用**: 99.9% 的服务可用性
- ✅ **HTTPS**: 自动 HTTPS 证书

## 部署架构选择

CloudPaste 提供两种部署架构供您选择，根据不同需求和使用场景灵活配置。

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

## 前期准备

### 1. 获取 Cloudflare API 信息

#### API Token

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 创建新的 API 令牌
3. 选择"编辑 Cloudflare Workers"模板，并 `添加 D1 数据库编辑权限` (原模板中没有D1，需要手动添加D1权限)

  ![cf-worker-api-token](/images/guide/cf-worker.png)

   ![D1](/images/guide/D1.png)

#### Account ID

在 Cloudflare 仪表板右侧边栏可以找到您的 Account ID。

### 2. Fork 项目仓库

访问 [CloudPaste 仓库](https://github.com/ling-drag0n/CloudPaste) 并点击 Fork 按钮。

## 配置 GitHub 仓库

### 1. 配置 GitHub Secrets

在您 Fork 的仓库中，进入 `Settings` → `Secrets and variables` → `Actions` → `New repository secret`，添加以下 Secrets：

| Secret 名称             | 必需 | 用途                                                  |
| ----------------------- | ---- | ----------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | ✅   | Cloudflare API 令牌（需要 Workers、D1 和 Pages 权限） |
| `CLOUDFLARE_ACCOUNT_ID` | ✅   | Cloudflare 账户 ID                                    |
| `ENCRYPTION_SECRET`     | ❌   | 用于加密敏感数据的密钥（如不提供，将自动生成）        |
| `ACTIONS_VAR_TOKEN`     | ✅   | 用于部署控制面板的 GitHub Token（使用控制面板时需要，如不使用则不需要） |

### 2. （可选）配置部署控制面板

如果您想使用可视化控制面板管理自动部署开关，需要额外配置：

**创建 GitHub Personal Access Token：**

1. 访问 [GitHub Token 设置](https://github.com/settings/tokens)
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置 Token 名称（如 `CloudPaste Deployment Control`）
4. 选择权限：
   - ✅ **repo** (完整仓库访问权限)
   - ✅ **workflow** (工作流权限)
5. 点击 **Generate token**
6. 复制 Token 并保存为 Secret `ACTIONS_VAR_TOKEN`
7. 如图所示填入对应仓库的密钥中

   ![github](/images/guide/github.png)

**使用控制面板：**

1. 进入仓库 **Actions** 标签页
2. 在左侧工作流列表中，点击 **🎛️ 部署控制面板**
3. 点击右侧 **Run workflow** → **Run workflow**
4. 在弹出界面中选择要开启/关闭的部署方式
5. 点击 **Run workflow** 应用配置
6. 控制面板会在写入开关状态后，自动触发对应的部署工作流一次（是否真正部署由当前开关状态决定）
7. 如图所示：图为是只开启 **Worker前后端一体化** 的部署方式
   ![github-action](/images/guide/github-action.png)


## 🔄 一体化部署教程（推荐）

### 部署步骤

#### 1️⃣ 配置完成 GitHub Secrets

参考上方"配置 GitHub 仓库"章节完成配置。

#### 2️⃣ 触发部署工作流

**方式一：手动触发（首次部署推荐）**

- 进入仓库 **Actions** 标签页
- 点击左侧 **Deploy SPA CF Workers[一体化部署]**
- 点击右侧 **Run workflow** → 选择 `main` 分支 → **Run workflow**

**方式二：自动触发**

- 使用部署控制面板开启 **SPA 一体化自动部署**
- 之后每次推送 `frontend/` 或 `backend/` 目录的代码到 `main` 分支时自动部署

::: tip 提示
在 Actions 页面手动运行 **Deploy SPA CF Workers[一体化部署]** 工作流时，会强制部署一次，不受自动部署开关影响；自动部署行为（push 或控制面板触发）始终由 `SPA_DEPLOY` 开关控制。
:::

#### 3️⃣ 等待部署完成

部署过程约 3-5 分钟，工作流会自动完成以下步骤：

- ✅ 构建前端静态资源
- ✅ 安装后端依赖
- ✅ 创建/验证 D1 数据库
- ✅ 初始化数据库表结构
- ✅ 设置加密密钥
- ✅ 部署到 Cloudflare Workers

部署成功后，您会在 Actions 日志中看到类似输出：

```
Published cloudpaste-spa (X.XX sec)
  https://cloudpaste-spa.your-account.workers.dev
```

### 部署完成

**访问您的应用：** `https://cloudpaste-spa.your-account.workers.dev`

**后续配置：**

1. 首次访问会自动初始化数据库
2. 使用默认管理员账户登录：
   - 用户名：`admin`
   - 密码：`admin123`
3. **⚠️ 重要：立即修改默认管理员密码！**
4. 在管理员面板中配置您的 S3/WEBDAV 兼容存储服务
5. （可选）在 Cloudflare Dashboard 中绑定自定义域名

**优势回顾：**
- ✅ 前后端同源，无跨域问题
- ✅ 导航请求免费，降低成本 60%+
- ✅ 一次部署完成，管理简单

---

## 🔀 前后端分离部署教程

如果您选择前后端分离部署，请按以下步骤操作：

### 后端部署

#### 1️⃣ 配置完成 GitHub Secrets

参考上方"配置 GitHub 仓库"章节完成配置。

#### 2️⃣ 触发后端部署

**方式一：手动触发**

- 进入仓库 **Actions** 标签页
- 点击左侧 **Deploy Backend CF Workers[Worker后端分离部署]**
- 点击 **Run workflow** → **Run workflow**

**方式二：自动触发**

- 使用部署控制面板开启 **后端分离自动部署**
- 推送 `backend/` 目录代码时自动部署

#### 3️⃣ 等待部署完成

工作流会自动完成：

- ✅ 创建/验证 D1 数据库
- ✅ 初始化数据库表结构
- ✅ 设置加密密钥
- ✅ 部署 Worker 到 Cloudflare

#### 4️⃣ 记录后端地址

部署成功后记下您的后端 Worker URL：
`https://cloudpaste-backend.your-account.workers.dev`

::: warning 重要
记住您的后端域名，前端部署时需要使用！
:::

### 前端部署

#### 1️⃣ 触发前端部署

**方式一：手动触发**

- 进入仓库 **Actions** 标签页
- 点击左侧 **Deploy Frontend CF Pages[Pages前端分离部署]**
- 点击 **Run workflow** → **Run workflow**

**方式二：自动触发**

- 使用部署控制面板开启 **前端分离自动部署**
- 推送 `frontend/` 目录代码时自动部署

::: tip 提示
在 Actions 页面手动运行「后端」「前端」部署工作流时，同样会强制部署一次，不受自动部署开关影响；自动部署行为由 `BACKEND_DEPLOY` / `FRONTEND_DEPLOY` 开关控制。
:::

#### 2️⃣ 配置环境变量

**必须步骤：前端部署完成后，需要手动配置后端地址！**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 **Pages** → **cloudpaste-frontend**
3. 点击 **Settings** → **Environment variables**
4. 添加环境变量：
   - **名称**：`VITE_BACKEND_URL`
   - **值**：您的后端 Worker URL（如 `https://cloudpaste-backend.your-account.workers.dev`）
   - **注意**：末尾不带 `/`，建议使用自定义域名

::: warning 重要
必须填写完整的后端域名，格式：`https://xxxx.com`
:::

#### 3️⃣ 重新部署前端

**重要：配置环境变量后，必须再次运行前端工作流！**

- 返回 GitHub Actions
- 再次手动触发 **Deploy Frontend CF Pages** 工作流
- 这样才能加载后端域名配置

#### 4️⃣ 访问应用

前端部署地址：`https://cloudpaste-frontend.pages.dev`

::: warning 注意
务必严格按照步骤操作，否则会出现后端域名加载失败！
:::

---

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
