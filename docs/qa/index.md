# 常见问题

这里收集了 CloudPaste 使用过程中的常见问题和解决方案。

## 🚀 部署相关

### Q: GitHub Actions 部署失败怎么办？

**A:** 请检查以下几点：

1. **API Token 权限**：确保 Cloudflare API Token 具有以下权限：

   - Account: Cloudflare Workers:Edit
   - Zone: Zone:Read
   - Account: Cloudflare Pages:Edit
   - Account: D1:Edit

2. **Account ID**：确认 Cloudflare Account ID 配置正确

3. **Secrets 配置**：检查 GitHub Secrets 是否正确设置：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### Q: Github Action 部署成功，但是访问不了怎么办？

**A:** 请检查：

1. **后端是否自定义域名**：

   大陆内，如果没有开梯子，默认提供的worker.dev是无法访问的。
   请自定义域名后访问。


2. **前端配置的环境变量问题**：

   配置的后端域名是否正确，为:"https://your-backend-domain.com" 格式，末尾不带斜杠。

3. **前端环境变量配置后是否重新action**：

   配置好后，请重新运行一遍 github action。

### Q: 国内无法访问 .workers.dev 域名怎么办？

**A:** 建议配置自定义域名：

1. 在 Cloudflare Workers 控制台添加自定义域名
2. 配置 DNS 解析
3. 更新前端环境变量中的后端地址

## 🔧 配置相关

### Q: S3 存储配置失败怎么办？

**A:** 请检查：

1. **访问密钥**：确认 Access Key ID 和 Secret Access Key 正确
2. **存储桶权限**：确保存储桶允许读写操作
3. **CORS 配置**：检查 CORS 规则是否正确配置
4. **网络连接**：确认服务器能够访问 S3 端点

### Q: WebDAV 挂载失败怎么办？

**A:** 常见解决方案：

1. **URL 格式**：确保使用正确的 WebDAV URL 格式（后端域名）

   ```
   https://your-domain.com/dav
   ```

2. **认证信息**：检查用户名和密码是否正确
3. **权限设置**：确认 API 密钥具有文件和挂载权限
4. **客户端兼容性**：尝试不同的 WebDAV 客户端

### Q: 文件上传失败怎么办？

**A:** 请检查：

1. **文件大小**：确认文件大小未超过限制
2. **存储空间**：检查存储空间是否充足
3. **网络连接**：确认网络连接稳定
4. **浏览器兼容性**：尝试不同浏览器
5. **S3 跨域访问**：检查 S3 配置是否正确

## 🔐 权限相关

### Q: 忘记管理员密码怎么办？

**A:** 假如用户名是 "admin" 情况下，根据不同的部署方式，可以通过以下方式重置管理员密码：

#### 方法一：Cloudflare D1 数据库重置（适用于 Cloudflare Workers 部署）

1. **使用 Wrangler CLI 重置密码**：

   ```bash
   # 重置为默认密码 "admin123"（SHA-256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9）
   npx wrangler d1 execute cloudpaste-db --command="UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"

   # 或者设置自定义密码（需要先计算 SHA-256 哈希值）
   # 例如密码 "newpassword123" 的 SHA-256 哈希值
   npx wrangler d1 execute cloudpaste-db --command="UPDATE admins SET password = 'your-sha256-hash-here' WHERE username = 'admin';"
   ```
2. **D1数据库直接修改密码**：

   手动修改数据库中的密码：240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

3. **本地开发环境重置**：
   ```bash
   # 本地开发数据库重置
   npx wrangler d1 execute cloudpaste-db --local --command="UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"
   ```

#### 方法二：Docker 部署 SQLite 数据库重置

1. **进入 Docker 容器**：

   ```bash
   # 查看运行中的容器
   docker ps

   # 进入后端容器
   docker exec -it <backend-container-name> sh
   ```

2. **使用 SQLite 命令行重置**：

   ```bash
   # 在容器内执行
   sqlite3 /app/data/database.db

   # 在 SQLite 命令行中执行
   UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';
   .exit
   ```

3. **或者直接执行 SQL 命令**：
   ```bash
   # 直接在宿主机执行（如果数据库文件挂载到宿主机）
   docker exec <backend-container-name> sqlite3 /app/data/database.db "UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"
   ```

#### 密码哈希值计算

如果需要设置自定义密码，可以使用以下方式计算 SHA-256 哈希值：

```bash
# 使用 Node.js 计算（推荐）
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"

# 使用 Python 计算
python3 -c "import hashlib; print(hashlib.sha256('your-password'.encode()).hexdigest())"

# 使用在线工具
# 访问 https://emn178.github.io/online-tools/sha256.html
```

#### 注意事项

- 默认重置密码为 `admin123`
- 重置后请立即登录并修改为安全密码
- 建议定期更换管理员密码
- 确保数据库备份后再进行操作

## 📱 使用相关

### Q: Markdown 编辑器功能异常怎么办？

**A:** 尝试以下解决方案：

1. **清除缓存**：清除浏览器缓存和 Cookie
2. **禁用扩展**：暂时禁用浏览器扩展
3. **更换浏览器**：尝试使用不同浏览器
4. **检查网络**：确认网络连接正常

### Q: 文件预览不显示怎么办？

**A:** 可能的原因和解决方案：

1. **文件格式**：确认文件格式受支持
2. **文件大小**：检查文件大小是否过大
3. **存储配置**：确认存储服务配置正确
4. **CORS 设置**：检查存储服务的 CORS 配置

关于视频预览：
   视频在线播放支持格式为：
   - mp4(h264 编码)
   - hls(xx.m3u8)
   - flv

   如视频播放不了，或者播放后无画面、无声音。因为所有网页视频都是由浏览器进行解码播放，出现此情况就是浏览器不支持该视频类型的解码

### Q: 分享链接无法访问怎么办？

**A:** 请检查：

1. **链接有效期**：确认分享链接未过期
2. **访问密码**：如果设置了密码，确认密码正确
3. **访问次数**：检查是否超过最大访问次数
4. **服务状态**：确认服务正常运行

## 🛠 故障排除

### Q: 如何查看详细错误信息？

**A:** 可以通过以下方式：

1. **浏览器控制台**：按 F12 查看控制台错误
2. **服务器日志**：查看后端服务日志
3. **Docker 日志**：使用 `docker-compose logs` 查看
4. **Cloudflare 日志**：在 Cloudflare 控制台查看 Workers 日志

### Q: 如何更新到最新版本？

**A:** 更新方法：

1. **GitHub Actions**：推送最新代码自动部署
2. **Docker 部署**：
   ```bash
   docker-compose pull
   docker-compose up -d --force-recreate
   ```
3. **手动部署**：重新执行部署步骤

## 贡献问题解答

如果您遇到了新的问题并找到了解决方案，欢迎：

1. 提交 Pull Request 更新此文档
2. 在 GitHub Discussions 中分享经验
3. 帮助其他用户解决类似问题

---

