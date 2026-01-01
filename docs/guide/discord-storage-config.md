# Discord 存储配置

CloudPaste 支持将 **Discord 频道** 作为存储后端，通过 Discord Bot API 实现文件的上传、下载和管理。

常见场景：

- 利用 Discord 的免费存储空间；
- 需要一个简单、免费的文件存储方案；
- 已有 Discord 服务器，希望直接复用。

> Discord 存储驱动 **不提供直链（DirectLink）能力**，所有文件访问都通过 CloudPaste 的代理链路。


## 支持的功能

Discord 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **PROXY**：代理访问
- ✅ **MULTIPART**：分片上传（大文件，支持断点续传）
- ✅ **ATOMIC**：原子操作支持（重命名、复制、批量删除）
- ❌ **DIRECT_LINK**：不支持直链下载（Discord CDN URL 约 24 小时后过期）

> **注意**：
> - 删除操作仅删除 CloudPaste 索引，**不会删除 Discord 中的消息/文件**
> - 普通服务器单文件直传上限为 **10MB**，超过需使用分片上传
> - Discord CDN URL 约 24 小时后过期，CloudPaste 会自动刷新


## 1. 准备工作

### 1.1 创建 Discord Bot

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications) 并登录
2. 点击右上角 **New Application**，输入名称（如 `CloudPaste Storage`）
3. 在左侧菜单选择 **Bot**，点击 **Add Bot**
4. 点击 **Reset Token**，复制生成的 Token 并妥善保存

![discord-1](/images/guide/discord/discord-1.png)

> **安全提示**：Bot Token 相当于密码，请勿泄露给他人。如果泄露，请立即重置。

### 1.2 获取频道 ID

1. 打开 Discord 客户端，进入 **用户设置** → **高级** → 开启 **开发者模式**
2. 在目标服务器中，右键点击要用作存储的频道
3. 选择 **复制频道 ID**

![discord-2](/images/guide/discord/discord-2.png)

频道 ID 是一串纯数字，例如：`1234567890123456789`

> **建议**：创建一个专用的私密频道用于文件存储，避免与正常聊天混淆。

### 1.3 添加 Bot 到服务器

1. 在 Discord Developer Portal，选择 **OAuth2** → **URL Generator**
2. 在 **SCOPES** 中勾选 `bot`
3. 在 **BOT PERMISSIONS** 中勾选：
   - `View Channels`（查看频道）
   - `Send Messages`（发送消息）
   - `Attach Files`（附加文件）
   - ...
4. 复制生成的 URL，在浏览器中打开，选择服务器并授权

![discord-3](/images/guide/discord/discord-3.png)
![discord-4](/images/guide/discord/discord-4.png)

## 2. 新建 Discord 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **Discord**
4. 填写配置信息（见下文字段说明）
5. 点击「测试连接」验证配置是否正确
6. 保存后，在「挂载管理」中为这个存储创建挂载点

> 建议先用小文件测试上传/下载，确认功能正常后再大规模使用。


## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「Discord 文件存储」「DC 备份频道」。

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算，不会真的限制 Discord 存储。
  - Discord 本身没有公开的存储容量限制。

### 3.2 Discord 配置

> 这是 Discord 存储的核心配置

- **Bot Token（bot_token）** *必填*
  - 从 Discord Developer Portal 获取的 Bot Token
  - 格式：`MTIzNDU2Nzg5.GhIjKl.MnOpQrStUvWxYz...`
  - 会在后端加密存储（AES-256-GCM）

- **频道 ID（channel_id）** *必填*
  - 存储文件的目标频道 ID
  - **必须是纯数字**（Snowflake 格式），例如：`1234567890123456789`

### 3.3 高级配置

- **分片大小（part_size_mb）**（可选）
  - 分片上传时每个分片的大小，单位 MB
  - 默认：10 MB
  - **注意**：普通服务器最大 10MB，Nitro 服务器最大 25MB

- **上传并发数（upload_concurrency）**（可选）
  - 同时进行的上传请求数量
  - 默认：1
  - 较高的并发可能触发 Discord API 限流（429 错误）

- **URL 代理（url_proxy）**（可选）
  - 用于覆盖 Discord CDN 域名的代理地址
  - 适用于 Discord CDN 访问较慢的地区

### 3.4 文件大小限制

| 服务器类型 | 单附件限制 | 总文件大小限制 |
|-----------|-----------|---------------|
| 普通服务器 | 10 MB | 无限制（分片） |
| Nitro 服务器 | 25 MB | 无限制（分片） |

> **分片上传**：超过单附件限制的文件会自动分片，每个分片作为单独的 Discord 消息附件存储。


## 4. 工作原理

### 4.1 VFS 架构

Discord 没有"目录"概念，CloudPaste 通过 **VFS（虚拟文件系统）** 实现目录树：

- **目录树**：由 CloudPaste 的 `vfs_nodes` 表管理
- **文件内容**：存储在 Discord 频道的消息附件中
- **索引关联**：通过 `content_ref` 记录文件与 Discord 消息的对应关系

```
CloudPaste VFS                    Discord
┌─────────────────┐              ┌─────────────────┐
│  /documents/    │              │                 │
│    ├── a.pdf    │──────────────│  Message #123   │
│    └── b.docx   │──────────────│  Message #124   │
│  /images/       │              │                 │
│    └── c.jpg    │──────────────│  Message #125   │
└─────────────────┘              └─────────────────┘
```

### 4.2 文件存储格式

每个文件在 CloudPaste 中记录为一个 `manifest`：

**单文件（≤10MB）**：
```json
{
  "kind": "discord_attachment_v1",
  "storage_type": "DISCORD",
  "channel_id": "1234567890123456789",
  "message_id": "9876543210",
  "attachment_id": "1111222233",
  "filename": "example.pdf",
  "size": 1048576
}
```

**分片文件（>10MB）**：
```json
{
  "kind": "discord_chunks_v1",
  "storage_type": "DISCORD",
  "channel_id": "1234567890123456789",
  "file_name": "large_file.zip",
  "file_size": 52428800,
  "part_size": 10485760,
  "total_parts": 5,
  "parts": [
    { "partNo": 1, "message_id": "...", "attachment_id": "...", "size": 10485760 }
  ]
}
```

### 4.3 分片上传流程

```bash
# 1. 前端创建上传会话
POST /api/fs/multipart/init
→ 返回 upload_session_id

# 2. 前端上传分片
PUT /api/fs/multipart/upload-chunk
Header: Content-Range: bytes 0-10485759/52428800
→ 后端转发到 Discord，保存 message_id 到 upload_parts

# 3. 完成上传
POST /api/fs/multipart/complete
→ 聚合所有分片元数据为 Manifest
```

### 4.4 Manifest 结构

每个文件的完整信息存储在 Manifest 中：

```json
{
  "kind": "discord_chunks_v1",
  "storage_type": "DISCORD",
  "channel_id": "1234567890123456789",
  "file_name": "example.zip",
  "file_size": 52428800,
  "part_size": 10485760,
  "total_parts": 5,
  "parts": [
    {
      "part_number": 1,
      "message_id": "1234567890123456790",
      "attachment_id": "1234567890123456791",
      "cdn_url": "https://cdn.discordapp.com/attachments/...",
      "size": 10485760
    }
  ]
}
```

### 4.5 安全机制

| 机制 | 实现方式 | 说明 |
|-----|---------|------|
| Token 加密 | AES-256-GCM | Bot Token 在数据库中加密存储 |
| 会话验证 | `assertUploadSessionOwnedByUser` | 双重验证（user_id + user_type）防止会话劫持 |
| 用户 ID 规范化 | `normalizeUploadSessionUserId` | 统一用户标识格式 |

### 4.6 下载流程

1. 根据 VFS 路径查找索引节点
2. 解析 manifest 获取 Discord 附件信息
3. 调用 Discord API 获取最新的下载 URL（CDN URL 会过期）
4. 按分片顺序拼接并返回文件流

> **Range 请求支持**：Discord 存储支持 HTTP Range 请求，可实现视频拖动播放。


## 5. 挂载与权限配合

Discord 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 Discord 的那条存储配置
3. 填写挂载路径（如 `/discord`）、备注等
4. 视情况开启：
   - **Web 代理**：Discord 必须走代理，此选项通常保持开启
   - **启用签名**：是否对代理入口签名保护

同时，Discord 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)


## 6. 常见问题

### 6.1 测试连接失败：bot_token 无效

**错误信息：**
> Discord 测试失败：bot_token 无效或无法访问

**可能原因：**
- Token 输入错误或包含多余空格
- Bot 已被删除或禁用

**解决方法：**
1. 检查 Token 格式是否正确
2. 在 Discord Developer Portal 确认 Bot 状态
3. 如有必要，重新创建 Bot 或重置 Token

### 6.2 测试连接失败：channel_id 无法访问

**错误信息：**
> bot_token 可用，但 channel_id 无法访问

**可能原因：**
- Bot 不在目标服务器中
- Bot 没有访问该频道的权限
- Channel ID 格式错误

**解决方法：**
1. 确认 Bot 已被添加到服务器
2. 确认 Bot 拥有「查看频道」「发送消息」「附加文件」权限
3. 检查 Channel ID 是否为纯数字格式

### 6.3 上传失败：文件过大

**错误信息：**
> DISCORD 单次上传过大：普通上传仅支持 ≤10MB

**解决方法：**
1. **使用分片上传**：通过「挂载浏览器」上传，会自动分片
2. **压缩文件**：将大文件压缩后再上传
3. **Nitro 服务器**：如果服务器有 Nitro 加成，可将 `part_size_mb` 调至 25

### 6.4 下载链接过期

**说明**：Discord CDN URL 约 24 小时后自动过期。

**解决方法**：
- CloudPaste 会自动刷新过期的 URL，无需手动处理
- 如果仍无法访问，检查 Bot Token 是否有效

### 6.5 删除文件后 Discord 中仍有消息

**说明**：这是设计行为。CloudPaste 仅删除自己的索引，**不会删除 Discord 中的消息**。

**原因**：
- 删除消息需要额外的 Bot 权限和 API 调用
- 保留消息可以作为备份
- 避免误删导致数据丢失

**如需彻底删除**：请手动在 Discord 频道中删除对应消息。

### 6.6 频繁出现 429 错误（限流）

**可能原因：**
- 上传并发数过高
- 短时间内请求过于频繁

**解决方法：**
1. 降低 `upload_concurrency`（建议设为 1）
2. 避免同时进行大量文件操作
3. 等待几分钟后重试

### 6.7 使用自定义代理

**使用场景**：Discord CDN 在某些地区访问较慢，可使用自建代理加速。

**配置方式**：
```json
{
  "url_proxy": "https://your-proxy-domain.com"
}
```

**注意**：代理服务器需要转发请求到 `cdn.discordapp.com`。

### 6.8 普通服务器 vs Nitro 服务器

| 对比项 | 普通服务器 | Nitro 服务器 |
|-------|-----------|-------------|
| 附件大小 | 10 MB | 25 MB |
| 推荐 part_size_mb | 8-10 | 10-25 |
| 上传速度 | 较慢（分片多） | 较快（分片少） |

> **如何判断服务器类型**：在服务器设置中查看服务器所有者是否订阅了 Discord Nitro。

### 6.9 数据备份

**方式一：导出数据库**
```bash
# 备份 vfs_nodes 和 upload_sessions 表
mysqldump -u user -p database vfs_nodes upload_sessions > backup.sql
```

**方式二：保留 Discord 频道**
- Discord 消息会永久保存（除非手动删除）
- 即使 CloudPaste 数据库丢失，也可以从频道消息中恢复文件


## 7. API 速率限制

Discord API 使用动态的速率限制机制：

- **全局速率限制**：每个 Bot Token 最多 **50 次请求/秒**
- **端点速率限制**：不同 API 端点有各自的限制，通过 `X-RateLimit-*` 响应头返回
- **资源级限制**：按 `channel_id`、`guild_id` 等资源独立计算

> **重要**：Discord 官方文档明确指出速率限制不应硬编码，应通过解析响应头动态处理。CloudPaste 已内置完整的 429 错误处理和自动重试机制。

**CloudPaste 的处理方式：**
- 触发 429 时，自动解析 `retry_after` / `Retry-After` / `X-RateLimit-Reset-After` 并等待后重试
- 通过 `upload_concurrency` 参数控制并发请求数（默认为 1）
- 最多自动重试 3 次，避免无限循环

**建议**：保持默认并发数 1，避免频繁触发限流。


## 8. 参考资源

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord API 文档](https://discord.com/developers/docs/intro)
- [Discord Bot 权限计算器](https://discordapi.com/permissions.html)
