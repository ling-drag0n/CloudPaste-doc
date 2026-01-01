# Telegram 存储配置

CloudPaste 支持将 **Telegram 频道/群组** 作为存储后端，通过 Telegram Bot API 实现文件的上传、下载和管理。

常见场景：

- 利用 Telegram 的免费无限存储空间；
- 需要一个简单、免费的文件存储方案；
- 已有 Telegram 频道/群组，希望直接复用。

> Telegram 存储驱动 **不提供直链（DirectLink）能力**，所有文件访问都通过 CloudPaste 的代理链路。


## 支持的功能

Telegram 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **PROXY**：代理访问
- ✅ **MULTIPART**：分片上传（大文件，支持断点续传）
- ✅ **ATOMIC**：原子操作支持（重命名、复制、批量删除）
- ❌ **DIRECT_LINK**：不支持直链下载

> **注意**：
> - 删除操作仅删除 CloudPaste 索引，**不会删除 Telegram 中的消息/文件**
> - 官方 Bot API 模式下，单文件直传上限为 **20MB**
> - 自建 Bot API 模式下，无文件大小限制


## 1. 准备工作

### 1.1 创建 Telegram Bot

1. 在 Telegram 中搜索 [@BotFather](https://t.me/BotFather) 并打开对话
2. 发送 `/newbot` 命令
3. 按提示输入 Bot 名称（显示名）和用户名（以 `_bot` 结尾）
4. 创建成功后，BotFather 会返回 **Bot Token**，格式类似：
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
5. **保存好这个 Token**，后续配置需要使用

> **安全提示**：Bot Token 相当于密码，请勿泄露给他人。

### 1.2 创建频道或群组

推荐使用 **私有频道** 作为存储目标：

1. 在 Telegram 中创建一个新频道（Channel）
2. 设置为 **私有频道**（Private Channel）
3. 将你的 Bot 添加为频道管理员：
   - 进入频道设置 → 管理员 → 添加管理员
   - 搜索你的 Bot 用户名并添加
   - 确保 Bot 拥有 **发送消息** 权限

> **为什么推荐频道？**
> - 频道没有成员数量限制
> - 频道消息不会被自动清理
> - 私有频道可以保护文件隐私

### 1.3 获取 Chat ID

Chat ID 是频道/群组的唯一标识，获取方法：

**方法一：使用 @RawDataBot**

1. 将 [@RawDataBot](https://t.me/RawDataBot) 添加到你的频道/群组
2. 在频道中发送任意消息
3. RawDataBot 会回复消息详情，找到 `"chat": { "id": -100xxxxxxxxxx }`
4. 这个数字（包含负号）就是 Chat ID
5. 获取后可将 RawDataBot 移除

**方法二：通过 Bot API**

1. 将你的 Bot 添加到频道/群组
2. 在频道中发送一条消息
3. 访问 `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. 在返回的 JSON 中找到 `chat.id`

> **Chat ID 格式说明**：
> - 频道 ID 通常以 `-100` 开头，如 `-1001234567890`
> - 群组 ID 通常是负数，如 `-123456789`
> - 私聊 ID 是正数


## 2. 新建 Telegram 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **Telegram**
4. 填写配置信息（见下文字段说明）
5. 点击「测试连接」验证配置是否正确
6. 保存后，在「挂载管理」中为这个存储创建挂载点

> 建议先用小文件测试上传/下载，确认功能正常后再大规模使用。


## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「Telegram 文件存储」「TG 备份频道」。

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算，不会真的限制 Telegram 存储。
  - Telegram 本身没有公开的存储容量限制。

### 3.2 Telegram 配置

> 这是 Telegram 存储的核心配置

- **Bot Token（bot_token）** *必填*
  - 从 @BotFather 获取的 Bot API Token
  - 格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
  - 会在后端加密存储

- **目标 Chat ID（target_chat_id）** *必填*
  - 存储文件的目标频道/群组 ID
  - **必须是纯数字**（可以带负号），例如：`-1001234567890`
  - 不支持用户名格式（如 `@channel_name`）

- **API 地址（api_base_url）**（可选）
  - 自定义 Telegram Bot API 端点
  - 默认：`https://api.telegram.org`
  - 用于自建 Bot API Server 场景

### 3.3 高级配置

- **Bot API 模式（bot_api_mode）**

  | 模式 | 说明 | 文件大小限制 |
  |------|------|--------------|
  | `official`（默认） | 使用 Telegram 官方 API | 直传 ≤ 20MB，分片每片 ≤ 20MB |
  | `self_hosted` | 使用自建 Bot API Server | 无限制 |

  > 选择 `self_hosted` 时，需要同时配置 `api_base_url` 指向你的自建服务器。

- **分片大小（part_size_mb）**（可选）
  - 分片上传时每个分片的大小，单位 MB
  - 范围：5 - 100 MB
  - 默认：15 MB
  - **注意**：`official` 模式下建议 ≤ 20MB，否则可能出现「能上传但无法下载」的问题

- **上传并发数（upload_concurrency）**（可选）
  - 同时进行的上传请求数量
  - 默认：2
  - 较高的并发可能触发 Telegram API 限流（429 错误）

- **上传后校验（verify_after_upload）**（可选）
  - 上传完成后调用 `getFile` API 校验文件大小
  - 默认：开启
  - 可防止「上传成功但文件损坏」的情况


## 4. 工作原理

### 4.1 VFS 架构

Telegram 存储采用 **VFS（虚拟文件系统）架构**：

- **目录树**：由 CloudPaste 的 `vfs_nodes` 表管理
- **文件内容**：存储在 Telegram 频道/群组中
- **索引关联**：通过 `manifest` 记录文件与 Telegram 消息的对应关系

```
CloudPaste VFS                    Telegram
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

```json
{
  "kind": "telegram_manifest_v1",
  "storage_type": "TELEGRAM",
  "target_chat_id": "-1001234567890",
  "parts": [
    {
      "partNo": 1,
      "size": 15728640,
      "file_id": "AgACAgIAAxk...",
      "message_id": 123,
      "chat_id": "-1001234567890"
    }
  ]
}
```

### 4.3 上传流程

**直传（小文件 ≤ 20MB）**：
1. CloudPaste 调用 `sendDocument` API 发送文件到频道
2. 获取返回的 `file_id` 和 `message_id`
3. 创建 VFS 索引节点，关联 manifest

**分片上传（大文件）**：
1. 前端将文件切分为多个分片（默认 15MB/片）
2. 每个分片通过后端代理调用 `sendDocument`
3. 所有分片上传完成后，合并 manifest
4. 创建 VFS 索引节点

### 4.4 下载流程

1. 根据 VFS 路径查找索引节点
2. 解析 manifest 获取 `file_id` 列表
3. 调用 `getFile` API 获取下载链接
4. 按分片顺序拼接并返回文件流

> **Range 请求支持**：Telegram 存储支持 HTTP Range 请求，可实现视频拖动播放。


## 5. 自建 Bot API 模式

如果需要上传超过 20MB 的文件，可以部署自建的 Telegram Bot API Server。

### 5.1 为什么需要自建？

| 功能 | 官方 API | 自建 API |
|------|----------|----------|
| 下载文件大小 | ≤ 20MB | 无限制 |
| 上传文件大小 | ≤ 50MB | ≤ 2000MB |
| 文件直传大小 | ≤ 20MB | 无限制 |
| 请求速率限制 | 有限制 | 可配置 |

### 5.2 部署方式

这里使用的是Cloudpaste轻封装的docker [仓库地址](https://github.com/ling-drag0n/CloudPaste-tgbot)
内含HuggingFace部署代码。

使用 Docker 快速部署：
```bash
docker run -d \
  --name cloudpaste-tg-botapi \
  -p 7860:8081 \
  -e TELEGRAM_API_ID=<your_api_id> \
  -e TELEGRAM_API_HASH=<your_api_hash> \
  dragon730/cloudpaste-tg-botapi:latest
```
默认携带/tg为后缀可环境变量更改，部署后在cloudpaste中开启自托管，填入: "https://对应域名地址/tg" 即可
> 获取 `api_id` 和 `api_hash`：访问 [my.telegram.org](https://my.telegram.org) 创建应用。

### 5.3 配置 CloudPaste

在存储配置中：
- **API 地址**：填写 `http://your-server:8081`
- **Bot API 模式**：选择 `self_hosted`

### 5.4 注意事项

- 自建服务器需要稳定的网络连接
- 建议使用 HTTPS 保护传输安全
- 定期更新 telegram-bot-api 镜像


## 6. 挂载与权限配合

Telegram 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 Telegram 的那条存储配置
3. 填写挂载路径（如 `/telegram`）、备注等
4. 视情况开启：
   - **Web 代理**：Telegram 必须走代理，此选项通常保持开启
   - **启用签名**：是否对代理入口签名保护

同时，Telegram 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)


## 7. 常见问题

### 7.1 测试连接失败：bot_token 无效

**错误信息：**
> Telegram 测试失败：bot_token 无效或无法访问

**可能原因：**
- Token 输入错误或包含多余空格
- Bot 已被删除或禁用

**解决方法：**
1. 检查 Token 格式是否正确（数字:字母数字）
2. 在 @BotFather 中使用 `/mybots` 确认 Bot 状态
3. 如有必要，重新创建 Bot

### 7.2 测试连接失败：target_chat_id 无法访问

**错误信息：**
> bot_token 可用，但 target_chat_id 无法访问

**可能原因：**
- Bot 不在目标频道/群组中
- Bot 没有发送消息的权限
- Chat ID 格式错误

**解决方法：**
1. 确认 Bot 已被添加为频道管理员
2. 确认 Bot 拥有「发送消息」权限
3. 检查 Chat ID 是否为纯数字格式（如 `-1001234567890`）

### 7.3 上传失败：文件过大

**错误信息：**
> TELEGRAM 单次上传过大：未勾选"自建 Bot API"时（official），直传仅支持 ≤20MB

**解决方法：**
1. **使用分片上传**：通过「挂载浏览器」上传，会自动分片
2. **切换自建模式**：部署自建 Bot API Server，选择 `self_hosted` 模式
3. **压缩文件**：将大文件压缩后再上传

### 7.4 上传成功但下载失败

**可能原因：**
- `official` 模式下分片大小超过 20MB
- 网络问题导致部分分片上传不完整

**解决方法：**
1. 检查 `part_size_mb` 配置，确保 ≤ 20MB
2. 开启 `verify_after_upload` 校验上传完整性
3. 删除损坏文件后重新上传

### 7.5 频繁出现 429 错误（限流）

**可能原因：**
- 上传并发数过高
- 短时间内请求过于频繁

**解决方法：**
1. 降低 `upload_concurrency`（建议设为 1-2）
2. 避免同时进行大量文件操作
3. 等待几分钟后重试

### 7.6 删除文件后 Telegram 中仍有消息

**说明：**
这是设计行为。CloudPaste 仅删除自己的索引，**不会删除 Telegram 中的消息**。

**原因：**
- 删除消息需要额外的 Bot 权限
- 保留消息可以作为备份
- 避免误删导致数据丢失

**如需彻底删除：**
请手动在 Telegram 频道中删除对应消息。

### 7.7 视频无法拖动播放

**可能原因：**
- 文件 manifest 中缺少分片大小信息
- 浏览器不支持 Range 请求

**解决方法：**
1. 确保使用最新版本的 CloudPaste
2. 尝试使用其他浏览器
3. 重新上传视频文件


## 8. 性能优化建议

### 8.1 缓存优化

Telegram 存储内置文件信息缓存：
- 缓存 TTL：10 分钟
- 缓存容量：500 条（LRU 淘汰）

频繁访问的文件会自动缓存，减少 API 调用。

### 8.2 并发控制

- 默认并发数为 2，适合大多数场景
- 如果网络稳定，可适当提高到 3-4
- 如果频繁 429 错误，降低到 1

### 8.3 分片大小选择

| 场景 | 建议分片大小 |
|------|--------------|
| 官方 API + 稳定网络 | 15-20 MB |
| 官方 API + 不稳定网络 | 5-10 MB |
| 自建 API | 50-100 MB |


## 9. 参考资源

- [Telegram Bot API 文档](https://core.telegram.org/bots/api)
- [Telegram Bot API Server（自建）](https://github.com/tdlib/telegram-bot-api)
- [获取 API ID 和 Hash](https://my.telegram.org)
- [@BotFather](https://t.me/BotFather) - 创建和管理 Bot
- [@RawDataBot](https://t.me/RawDataBot) - 获取 Chat ID
