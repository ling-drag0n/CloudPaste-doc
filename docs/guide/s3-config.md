# S3 存储配置

CloudPaste 支持多种 S3 兼容的对象存储服务，为您的文件提供可靠的存储解决方案。

## 支持的存储服务

### 部分S3存储服务对比

::: tip 价格更新说明
以下价格基于 2024 年 12 月的最新官方信息，实际价格可能因地区、使用量和促销活动而有所不同。建议访问官方网站获取最新价格。
:::

| 服务商            | 免费额度                         | 存储费用                       | 流量费用                         | 1TB 月费用 | 推荐指数   | 适用场景             |
| ----------------- | -------------------------------- | ------------------------------ | -------------------------------- | ---------- | ---------- | -------------------- |
| **Backblaze B2**  | 前 10GB 免费                     | $6/TB/月                       | 3 倍存储量免费<br/>超出 $0.01/GB | $6         | ⭐⭐⭐⭐⭐ | 成本敏感，中等流量   |
| **Wasabi**        | 30 天 1TB 试用                   | $6.99/TB/月                    | 完全免费                         | $6.99      | ⭐⭐⭐⭐   | 大容量存储，低流量   |
| **Hetzner**       | 无                               | $5.99/TB/月                    | 包含 1TB 免费                    | $5.99      | ⭐⭐⭐⭐   | 欧洲用户，性价比优先 |
| **Cloudflare R2** | 10GB 存储/月<br/>100 万次操作/月 | $15/TB/月                      | 完全免费                         | $15        | ⭐⭐⭐⭐⭐ | 高流量应用，全球用户 |
| **DigitalOcean**  | 250GB 存储<br/>1TB 流量          | 基础套餐 $5/月<br/>额外 $20/TB | 包含 1TB                         | $20.48     | ⭐⭐⭐     | 已使用 DO 生态       |
| **Scaleway**      | 75GB 流量/月                     | €12-14.6/TB/月                 | 75GB 免费                        | €21-24     | ⭐⭐⭐     | 欧洲用户，小规模应用 |


### 其他兼容服务

- **阿里云 OSS**
- **腾讯云 COS**
- **七牛云 Kodo**
- **华为云 OBS**
- **Claw Cloud 存储桶**
- **缤纷云存储**
- **TeBi Cloud**
- **MinIO** (自建方案)

## Cloudflare R2 配置

### 1. 开通 R2 服务

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com)
2. 进入 "R2 Object Storage"
3. 点击 "Create bucket"
4. 输入存储桶名称（如 `cloudpaste-files-your-name`，需全局唯一）

### 2. 创建 API 令牌

1. 进入 "Manage R2 API tokens"
2. 点击 "Create API token"
3. 管理 API 令牌
   ![R2api](/images/guide/R2/R2-api.png)
   ![R2rw](/images/guide/R2/R2-rw.png)
4. 记录 Access Key ID 和 Secret Access Key

### 3. 获取端点信息

```
端点格式: https://<account-id>.r2.cloudflarestorage.com
```

在 R2 控制台的存储桶详情页面可以找到完整的端点 URL。
5. 配置跨域规则，点击对应存储桶，点击设置，编辑 CORS 策略，如下所示：

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://根据自己的前端域名来替代"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Backblaze B2 配置

1. 若没有 B2 账号，可以先[注册](https://www.backblaze.com/sign-up/cloud-storage?referrer=getstarted)一个，然后创建一个存储桶。
   ![B2账号注册](/images/guide/B2/B2-1.png)
2. 点击侧边栏的 Application Key，点击 Create Key，然后如图所示。
   ![B2key](/images/guide/B2/B2-2.png)
3. 配置 B2 的跨域，B2 跨域配置比较麻烦，需注意
   ![B2cors](/images/guide/B2/B2-3.png)
4. 可以先尝试一下 1 或 2，去到上传页面看看是否能上传，F12 打开控制台若显示跨域错误，则使用 3。要一劳永逸就直接使用 3（现在建议直接使用3）。

   ![B21](/images/guide/B2/B2-4.png)

关于 3 的配置由于面板无法配置，只能手动配置，需[下载 B2 CLI](https://www.backblaze.com/docs/cloud-storage-command-line-tools)对应工具。具体可以参考："https://docs.cloudreve.org/zh/usage/storage/b2 " 。

下载后，在对应下载目录 cmd，在命令行输入以下命令：
```txt
b2-windows.exe account authorize   //进行账号登录，根据提示填入之前的 keyID 和 applicationKey
b2-windows.exe bucket get <bucketName> //你可以执行获取bucket信息，<bucketName>换成桶名字
```

windows 配置，采用“.\b2-windows.exe xxx”，
所以在对应 cli 的 exe 文件夹中 cmd 输入，python 的 cli 也同理：

```cmd
b2-windows.exe bucket update <bucketName> allPrivate --cors-rules "[{\"corsRuleName\":\"CloudPaste\",\"allowedOrigins\":[\"*\"],\"allowedHeaders\":[\"*\"],\"allowedOperations\":[\"b2_upload_file\",\"b2_download_file_by_name\",\"b2_download_file_by_id\",\"s3_head\",\"s3_get\",\"s3_put\",\"s3_post\",\"s3_delete\"],\"exposeHeaders\":[\"Etag\",\"content-length\",\"content-type\",\"x-bz-content-sha1\"],\"maxAgeSeconds\":3600}]"
```

其中 " <**bucketName**> " 换成你的存储桶名字，关于允许跨域的域名 allowedOrigins 可以根据个人配置，这里是允许所有。

## MinIO 自建配置

### 1. 部署 MinIO

1. **部署 MinIO 服务器**

   使用以下 Docker Compose 配置（参考）快速部署 MinIO 服务：

   ```yaml
   version: "3"

   services:
     minio:
       image: minio/minio:RELEASE.2025-02-18T16-25-55Z
       container_name: minio-server
       command: server /data --console-address :9001 --address :9000
       environment:
         - MINIO_ROOT_USER=minioadmin # 设置管理员用户名
         - MINIO_ROOT_PASSWORD=minioadmin # 设置管理员密码
         - MINIO_BROWSER=on
         - MINIO_SERVER_URL=https://minio.example.com # S3 API 访问地址
         - MINIO_BROWSER_REDIRECT_URL=https://console.example.com # 控制台访问地址
       ports:
         - "9000:9000" # S3 API 端口
         - "9001:9001" # 控制台端口
       volumes:
         - ./data:/data
         - ./certs:/root/.minio/certs # 如需配置SSL证书
       restart: always
   ```

   运行 `docker-compose up -d` 启动服务。

2. **配置反向代理（参考）**

   为确保 MinIO 服务正常工作，特别是文件预览功能，需要正确配置反向代理。以下是 OpenResty/Nginx 的推荐配置：

   **MinIO S3 API 反向代理 (minio.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # HTTP 连接优化
       proxy_http_version 1.1;
       proxy_set_header Connection "";  # 启用HTTP/1.1的keepalive

       # 关键配置：解决403错误和预览问题
       proxy_cache off;
       proxy_buffering off;
       proxy_request_buffering off;

       # 无文件大小限制
       client_max_body_size 0;
   }
   ```

   **MinIO 控制台反向代理 (console.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9001;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # WebSocket 支持
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";

       # 关键配置
       proxy_cache off;
       proxy_buffering off;

       # 无文件大小限制
       client_max_body_size 0;
   }
   ```

3. **访问控制台创建存储桶和创建访问密钥**

   如有详细配置需求，可参考官方文档：https://min.io/docs/minio/container/index.html

   CN: https://min-io.cn/docs/minio/container/index.html

   ![minio-1](/images/guide/minio-1.png)

4. **相关配置（可选）**

   允许的源包含您的前端域名
   ![minio-2](/images/guide/minio-2.png)

5. **在 CloudPaste 中配置 MinIO**

   - 登录 CloudPaste 管理界面
   - 进入 "S3 存储配置" → "添加存储配置"
   - 选择 "其他兼容 S3 服务" 作为提供商类型
   - 填入以下信息：
      - 名称：自定义名称
      - 端点 URL：您的 MinIO 服务地址（如 `https://minio.example.com`）
      - 存储桶名称：之前创建的存储桶名称
      - 访问密钥 ID：您的 Access Key
      - 访问密钥：您的 Secret Key
      - 区域：可留空
      - 路径风格访问：必须启用！！！！
   - 点击 "测试连接" 确认配置正确
   - 保存配置

6. **注意与故障排查**

   - **注意事项**：如使用 Cloudfare 开启 cdn 可能需要加上 proxy_set_header Accept-Encoding "identity"，同时存在缓存问题，最好仅用 DNS 解析
   - **403 错误**：确保反向代理配置中包含 `proxy_cache off` 和 `proxy_buffering off`
   - **预览问题**：确保 MinIO 服务器正确配置了 `MINIO_SERVER_URL` 和 `MINIO_BROWSER_REDIRECT_URL`
   - **上传失败**：检查 CORS 配置是否正确，确保允许的源包含您的前端域名
   - **控制台无法访问**：检查 WebSocket 配置是否正确，特别是 `Connection "upgrade"` 设置


## 更多S3配置待续....

## 在 CloudPaste 中配置

### 1. 登录管理界面

使用管理员账号登录 CloudPaste 管理界面。

### 2. 添加存储配置

1. 进入 "S3 存储配置"
2. 点击 "添加存储配置"
3. 填写配置信息：
   - **配置名称**: 给配置起一个易识别的名称
   - **Access Key ID**: 访问密钥 ID
   - **Secret Access Key**: 访问密钥
   - **存储桶名称**: 存储桶名称
   - **端点 URL**: S3 端点地址
   - **区域**: 存储桶所在区域
   - **路径样式**: 是否强制使用路径样式

### 3. 测试连接

1. 点击 "测试连接" 按钮
2. 确认连接成功
3. 保存配置

### 4. 设置默认存储

1. 在存储配置列表中
2. 选择要设为默认的配置
3. 点击 "设为默认"

## 高级配置

### CORS 配置

为了支持直接上传，需要配置 CORS：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### CDN 加速（自定义HOST域名）

#### B2 + CloudFlare CDN实现免流量

参考链接：https://github.com/ling-drag0n/CloudPaste/issues/59

相关解答：https://github.com/ling-drag0n/CloudPaste/issues/67

.....

## 故障排除

### 常见问题

1. **连接失败**

   - 检查端点 URL 是否正确
   - 确认访问密钥有效
   - 验证网络连接

2. **权限错误**

   - 检查 IAM 策略配置
   - 确认存储桶权限设置
   - 验证 CORS 配置，是否配置跨域访问

3. **上传失败**
   - 检查文件大小限制
   - 确认存储空间充足
   - 验证文件格式支持

## 下一步

- [配置 WebDAV](/guide/webdav)
- [查看 API 文档](/api/)
- [了解开发指南](/development/)
- [GitHub Actions 部署](/guide/deploy-github-actions)
