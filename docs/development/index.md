# 开发指南

欢迎参与 CloudPaste 的开发！本指南将帮助您搭建开发环境并了解项目结构。

## 开发环境要求

### 系统要求

- **Node.js**: 版本 18 或更高
- **npm**: 版本 8 或更高（或 pnpm、yarn）
- **Git**: 版本控制工具

### 推荐工具

- **VS Code**: 代码编辑器
- **Wrangler CLI**: Cloudflare Workers 开发工具
- **Docker**: 容器化开发（可选）

## 快速开始

### 1. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/ling-drag0n/CloudPaste.git
cd CloudPaste
```

### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd frontend
npm install
```

### 3. 配置环境

#### 后端配置

创建 `backend/wrangler.toml` 文件：

```toml
name = "cloudpaste-backend-dev"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.development]
vars = { NODE_ENV = "development" }

[[env.development.d1_databases]]
binding = "DB"
database_name = "cloudpaste-db-dev"
database_id = "your-database-id"

[env.development.vars]
ENCRYPTION_SECRET = "your-development-secret"
```

#### 前端配置

创建 `frontend/.env.development` 文件：

```bash
VITE_BACKEND_URL=http://localhost:8787
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
```

### 4. 初始化数据库

```bash
# 创建开发数据库
cd backend
npx wrangler d1 create cloudpaste-db-dev

# 初始化数据库结构
npx wrangler d1 execute cloudpaste-db-dev --file=./schema.sql
```

### 5. 启动开发服务器

```bash
# 启动后端开发服务器
cd backend
npm run dev

# 在新终端启动前端开发服务器
cd frontend
npm run dev
```

现在您可以访问：

- 前端: http://localhost:5173
- 后端: http://localhost:8787

## 自定义 Docker 构建

如果您希望自定义 Docker 镜像或进行开发调试，可以按照以下步骤手动构建：

1. **构建后端镜像**

   ```bash
   # 在项目根目录执行
   docker build -t cloudpaste-backend:custom -f docker/backend/Dockerfile .

   # 运行自定义构建的镜像
   docker run -d --name cloudpaste-backend \
     -p 8787:8787 \
     -v $(pwd)/sql_data:/data \
     -e ENCRYPTION_SECRET=开发测试密钥 \
     cloudpaste-backend:custom
   ```

2. **构建前端镜像**

   ```bash
   # 在项目根目录执行
   docker build -t cloudpaste-frontend:custom -f docker/frontend/Dockerfile .

   # 运行自定义构建的镜像
   docker run -d --name cloudpaste-frontend \
     -p 80:80 \
     -e BACKEND_URL=http://localhost:8787 \
     cloudpaste-frontend:custom
   ```

3. **开发环境 Docker Compose**

   创建 `docker-compose.dev.yml` 文件：

   ```yaml
   version: "3.8"

   services:
     frontend:
       build:
         context: .
         dockerfile: docker/frontend/Dockerfile
       environment:
         - BACKEND_URL=http://backend:8787
       ports:
         - "80:80"
       depends_on:
         - backend

     backend:
       build:
         context: .
         dockerfile: docker/backend/Dockerfile
       environment:
         - NODE_ENV=development
         - RUNTIME_ENV=docker
         - PORT=8787
         - ENCRYPTION_SECRET=dev_secret_key
       volumes:
         - ./sql_data:/data
       ports:
         - "8787:8787"
   ```

   启动开发环境：

   ```bash
   docker-compose -f docker-compose.yml up --build
   ```

## 开发工作流

### 1. 创建功能分支

```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. 提交代码

```bash
# 添加文件
git add .

# 提交代码（使用规范的提交信息）
git commit -m "feat: add new feature"

# 推送到远程分支
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写详细的描述
3. 等待代码审查
4. 根据反馈修改代码

## 代码规范

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

示例：

```
feat: add file upload progress indicator
fix: resolve authentication token expiration issue
docs: update API documentation
```

## 调试技巧

### 前端调试

1. **Vue DevTools**: 安装 Vue.js devtools 浏览器扩展
2. **控制台日志**: 使用 `console.log` 进行调试
3. **网络面板**: 检查 API 请求和响应

### 后端调试

1. **Wrangler 日志**: 使用 `wrangler tail` 查看实时日志
2. **本地调试**: 在本地环境中调试 Worker 代码
3. **D1 查询**: 使用 `wrangler d1 execute` 查询数据库

## 贡献指南

### 报告 Bug

1. 搜索现有 Issues 确认问题未被报告
2. 创建新 Issue 并提供详细信息：
   - 问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息

### 提出功能请求

1. 在 GitHub Discussions 中讨论新功能
2. 创建 Feature Request Issue
3. 提供详细的功能描述和用例

### 代码贡献

1. Fork 项目仓库
2. 创建功能分支
3. 实现功能并添加测试
4. 确保所有测试通过
5. 提交 Pull Request

## 获取帮助

- **GitHub Issues**: 报告 bug 和功能请求
- **GitHub Discussions**: 社区讨论

## 下一步

- [API 开发指南](/api/)
- [部署指南](/guide/deploy-github-actions)
- [S3 存储配置](/guide/s3-config)
- [WebDAV 配置](/guide/webdav)
