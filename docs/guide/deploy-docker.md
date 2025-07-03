# Docker 部署

Docker 部署适合有服务器的用户，提供完整的容器化解决方案，支持本地存储和完全自主控制。

## 部署优势

- ✅ **一键部署**: Docker Compose 一键启动
- ✅ **完全控制**: 服务器完全自主控制
- ✅ **本地存储**: 支持本地文件存储
- ✅ **易于备份**: 数据持久化和备份
- ✅ **集群支持**: 支持多实例部署

## 系统要求

- **操作系统**: Linux、Windows、macOS
- **Docker**: 版本 20.10 或更高
- **Docker Compose**: 版本 2.0 或更高
- **内存**: 最少 512MB，推荐 1GB
- **存储**: 最少 1GB 可用空间

## 快速开始

### 方式一：Docker Compose（推荐）

1. **下载配置文件**
   ```bash
   curl -O https://raw.githubusercontent.com/ling-drag0n/CloudPaste/main/docker-compose.yml
   ```

2. **修改配置**
   ```bash
   nano docker-compose.yml
   ```

3. **启动服务**
   ```bash
   docker-compose up -d
   ```

### 方式二：前后端分开部署

#### 部署后端

```bash
# 创建数据目录
mkdir -p sql_data

# 运行后端容器
docker run -d --name cloudpaste-backend \
  -p 8787:8787 \
  -v $(pwd)/sql_data:/data \
  -e ENCRYPTION_SECRET=your-secret-key \
  -e NODE_ENV=production \
  -e RUNTIME_ENV=docker \
  -e LOG_LEVEL=2 \
  dragon730/cloudpaste-backend:latest
```

#### 部署前端

```bash
# 运行前端容器
docker run -d --name cloudpaste-frontend \
  -p 80:80 \
  -e BACKEND_URL=http://your-server-ip:8787 \
  dragon730/cloudpaste-frontend:latest
```

## 详细配置

### Docker Compose 配置

创建 `docker-compose.yml` 文件：

```yaml
version: "3.8"

services:
  frontend:
    # context: .
    #   dockerfile: docker/frontend/Dockerfile
    #   args:
    #     - VITE_BACKEND_URL= #构建时可以为空，因为会由entrypoint.sh覆盖
    image: dragon730/cloudpaste-frontend:latest
    environment:
      - BACKEND_URL=https://xxx.com # 填写后端服务地址，通过nginx反向代理控制即可。#运行时环境变量，将被entrypoint.sh使用
    ports:
      - "8080:80" #"127.0.0.1:8080:80"
    depends_on:
      - backend # 依赖backend服务,后端服务启动后，前端服务才能启动
    networks:
      - cloudpaste-network
    restart: unless-stopped

  backend:
    # build:
    #   context: .
    #   dockerfile: docker/backend/Dockerfile
    image: dragon730/cloudpaste-backend:latest
    environment:
      - NODE_ENV=production # 生产环境模式
      - RUNTIME_ENV=docker # 运行环境标识
      - PORT=8787 # 应用监听端口
      - LOG_LEVEL=2 # 日志级别
      # 重要: 请修改为您自己的安全密钥，用于加密数据
      - ENCRYPTION_SECRET=xxxxxxx
    volumes:
      - ./sql_data:/data # 将当前目录下的sql_data映射到容器的/data目录
    ports:
      - "8787:8787" #"127.0.0.1:8787:8787"
    networks:
      - cloudpaste-network
    restart: unless-stopped # 容器异常退出时自动重启

networks:
  cloudpaste-network:
    driver: bridge
```

### 环境变量说明

#### 后端环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NODE_ENV` | ❌ | `production` | 运行环境 |
| `RUNTIME_ENV` | ❌ | `docker` | 运行时环境 |
| `PORT` | ❌ | `8787` | 服务端口 |
| `LOG_LEVEL` | ❌ | `2` | 日志级别(低到高：1-3) |
| `ENCRYPTION_SECRET` | ✅ | - | 加密密钥（重要！） |

#### 前端环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `BACKEND_URL` | ✅ | - | 后端 API 地址 |

::: warning 安全提示
请务必修改 `ENCRYPTION_SECRET` 为您自己的安全密钥，并妥善保管！
:::

## 反向代理配置

### Nginx 配置示例

```nginx
server {
    listen 443 ssl;
    server_name paste.yourdomain.com;  # 替换为您的域名

    # SSL 证书配置
    ssl_certificate     /path/to/cert.pem;  # 替换为证书路径
    ssl_certificate_key /path/to/key.pem;   # 替换为密钥路径

    # 前端代理配置
    location / {
        proxy_pass http://localhost:80;  # Docker前端服务地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端API代理配置
    location /api {
        proxy_pass http://localhost:8787;  # Docker后端服务地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 0;

        # WebSocket支持 (如果需要)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # WebDav 配置
    location /dav/ {
        proxy_pass http://localhost:8787/dav/;  # 指向您的后端服务

        # WebDAV 必要头信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # WebDAV 方法支持
        proxy_pass_request_headers on;

        # 支持所有WebDAV方法
        proxy_method $request_method;

        # 必要的头信息处理
        proxy_set_header Destination $http_destination;
        proxy_set_header Overwrite $http_overwrite;

        # 处理大文件
        client_max_body_size 0;

        # 超时设置
        proxy_connect_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_read_timeout 3600s;
    }
}
```

## 更新和维护

### 更新到最新版本

```bash
# 拉取最新镜像
docker-compose pull

# 重新创建容器
docker-compose up -d --force-recreate
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs backend

# 实时查看日志
docker-compose logs -f
```

### 监控服务状态

```bash
# 查看服务状态
docker-compose ps

# 查看资源使用情况
docker stats
```

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

## 故障排除

### 常见问题

1. **容器启动失败**
   - 检查端口是否被占用
   - 确认环境变量配置正确
   - 查看容器日志

2. **前端无法连接后端**
   - 确认 `BACKEND_URL` 配置正确
   - 检查网络连接
   - 确认后端服务正常运行

3. **数据丢失**
   - 确认数据卷挂载正确
   - 检查文件权限
   - 定期备份数据

## 下一步

- [配置 S3 存储](/guide/s3-config)
- [设置 WebDAV](/guide/webdav)
- [查看 API 文档](/api/)
- [了解开发指南](/development/)
