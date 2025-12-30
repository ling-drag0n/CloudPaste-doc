# Google Drive 存储配置

CloudPaste 支持将 **Google Drive** 作为存储后端，基于 Google Drive v3 API 实现文件操作。

> [!WARNING]
> 💡 使用GoogleDrive 需要科学上网，自行处理

## 支持的功能

Google Drive 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **ATOMIC**：原子操作支持（批量删除、复制）
- ✅ **PROXY**：代理访问
- ✅ **MULTIPART**：分片上传（断点续传）
- ✅ **PAGED_LIST**：分页目录列表

## 1. 准备工作

### 1.0 可直接按照 OpenList 配置文档创建（推荐）

👉 https://doc.oplist.org/guide/drivers/google_drive

<details>
<summary><b>点击展开：若按照 OpenList 创建，请跳过此步骤</b></summary>

### 1.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/) 
2. 创建新项目或选择现有项目
3. 记录项目 ID

### 1.2 启用 Google Drive API

1. 进入 **API 和服务** → **库**
2. 搜索「Google Drive API」
3. 点击「启用」

![gd-0](/images/guide/GoogleDrive/gd-0.png)

### 1.3 配置 OAuth 同意屏幕

1. 选择用户类型（外部）
2. 填写应用信息：
   - **应用名称**：例如 `CloudPaste`
   - **用户支持电子邮件**：你的邮箱
   - **开发者联系信息**：你的邮箱

![gd-00](/images/guide/GoogleDrive/gd-00.png)

### 1.4 创建 OAuth 凭据

1. 进入 **API 和服务** → **凭据**
2. 点击「创建凭据」→ 选择「OAuth 客户端 ID」
3. 应用类型选择「Web 应用」
4. 填写名称，并添加授权重定向 URI （这里填写回调地址URL 具体参考第三方工具的回调地址callback）
5. 创建后记录：
   - **客户端 ID**
   - **客户端密钥**

![gd-1](/images/guide/GoogleDrive/gd-1.png)
![gd-2](/images/guide/GoogleDrive/gd-2.png)

6. 将自己添加到测试用户中，在左侧找到目标对象菜单，点击进入后，找到测试用户下方的+ Add User按钮，点击后输入你的 Google 账号邮箱地址，点击添加, 添加后顺便发布了

![gd-4](/images/guide/GoogleDrive/gd-4.png)

7. 到现在就已经完成了过程，把之前得到的ID和密钥在第三方API工具中直接填入，然后“不使用在线地址”点击获取刷新令牌，随后在Cloudpaste的存储配置中，依次填入ID和密钥和刷新令牌即可

### 1.5 获取 Refresh Token

#### 使用第三方工具

可以使用 [Google Drive Token 获取工具](https://api.oplist.org/) 等第三方工具简化获取流程。

### 1.6 另一种方式认证

1. 无需ID和密钥，在第三方API工具中勾选“使用在线地址”后，点击直接获取，即可得到刷新令牌
2. 刷新令牌填入Cloudpaste的存储配置，开启“在线地址”勾选，同样填入在线 API 地址
3. 此时配置中只需要“在线 API 地址”和刷新令牌即可完成。

</details>

## 2. 新建 Google Drive 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **Google Drive**
4. 填写配置信息（见下文）
5. 保存后，在「挂载管理」中为这个存储创建挂载点

## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「个人 Google Drive」「团队共享盘」

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算
  - 超出后会触发 CloudPaste 的限额提示

### 3.2 认证配置

> 这些字段决定 CloudPaste 如何连接你的 Google Drive

- **客户端 ID（client_id）** *必填*
  - Google Cloud OAuth 客户端 ID
  - 示例：`123456789012-xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

- **客户端密钥（client_secret）** *必填*
  - Google Cloud OAuth 客户端密钥
  - 会在后端加密存储
  - 编辑配置时，密码留空 = 不修改原有密码

- **刷新令牌（refresh_token）** *必填*
  - OAuth 2.0 刷新令牌
  - 用于自动获取和刷新访问令牌
  - 会在后端加密存储

### 3.3 高级配置

- **根目录 ID（root_id）**（可选）
  - 指定 Google Drive 中的起始目录 ID
  - 留空默认为 `root`（用户的云端硬盘根目录）
  - 共享盘场景：填写共享盘的 ID
  - 示例：`0B1234567890abcdefghij`

- **启用磁盘使用统计（enable_disk_usage）**（可选）
  - 勾选后，可在存储详情中查看配额使用情况
  - 会调用 Google Drive 的 `about.get` API 获取存储配额

- **启用"与我共享"视图（enable_shared_view）**（可选，默认启用）
  - 勾选后，挂载根目录下会出现一个虚拟目录 `__shared_with_me__`
  - 可浏览其他用户共享给你的文件
  - 注意：此目录为只读视图

- **Token 续期端点（api_address）**（可选）
  - 自定义 token 刷新服务的 URL
  - 如果不填，将直接使用 Google 官方 OAuth 端点
  - 适用场景：使用第三方 token 管理服务

- **使用 Online API（use_online_api）**（可选）
  - 勾选后，将使用 Online API 协议调用 token 续期端点
  - 仅在配置了 `api_address` 时生效

## 4. 特殊功能说明

### 4.1 "与我共享"虚拟视图

当启用 `enable_shared_view` 后，挂载根目录下会出现一个名为 `__shared_with_me__` 的虚拟目录：

- **用途**：浏览其他用户通过 Google Drive 共享给你的文件和文件夹
- **特点**：
  - 只读视图，不支持在此目录下上传或修改
  - 文件实际存储在共享者的 Drive 中
  - 支持下载和预览共享的文件
- **禁用**：如不需要此功能，可在存储配置中取消勾选

### 4.2 共享盘（Shared Drives）支持

如果你使用的是 Google Workspace 的共享盘：

1. 在 `root_id` 中填写共享盘的 ID
2. 确保 OAuth 账户有权限访问该共享盘
3. 所有文件操作将在该共享盘中进行

### 4.3 分片上传

Google Drive 存储支持断点续传式分片上传：

- 自动处理大文件上传
- 支持前端直传模式
- 空文件（0 字节）通过 metadata 创建，不占用上传流量

## 5. 挂载与权限配合

Google Drive 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 Google Drive 的那条存储配置
3. 填写挂载路径（如 `/gdrive`）、备注等
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护
   - **直链策略**：`native_direct` / `proxy` / `use_proxy_url`

同时，Google Drive 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)

## 6. 常见问题

### 6.1 连接失败 / 无法获取访问令牌

**可能原因：**
- `client_id` 或 `client_secret` 错误
- `refresh_token` 已过期或无效
- Google Cloud 项目未启用 Drive API
- OAuth 同意屏幕未正确配置

**解决方法：**
1. 检查 Google Cloud 项目配置是否正确
2. 确认 Drive API 已启用
3. 重新获取 refresh_token
4. 检查 OAuth 同意屏幕的范围设置

### 6.2 上传失败或速度很慢

**可能原因：**
- 网络延迟较高
- Google Drive API 限流
- 文件过大

**解决方法：**
1. 检查 CloudPaste 与 Google Drive 之间的网络连接
2. 大文件上传会自动使用 resumable upload
3. 如遇到限流，稍后重试

### 6.3 Refresh Token 过期

**现象：**
- 提示「无法获取访问令牌」
- 日志显示「invalid_grant」错误

**解决方法：**
1. Refresh token 可能因长时间未使用而失效
2. 重新执行授权流程获取新的 refresh_token
3. 在 CloudPaste 中更新存储配置

### 6.4 无法访问共享盘

**可能原因：**
- `root_id` 填写错误
- OAuth 账户无权限访问该共享盘

**解决方法：**
1. 确认共享盘 ID 正确（可从 Google Drive 网页版 URL 中获取）
2. 确保授权账户是共享盘的成员
3. 检查 OAuth 范围是否包含 `drive` 权限

### 6.5 "与我共享"目录不显示

**可能原因：**
- `enable_shared_view` 未启用

**解决方法：**
1. 编辑存储配置，勾选「启用"与我共享"视图」
2. 保存后刷新目录列表

## 7. 参考资源

- [OpenList Google Drive 配置](https://doc.oplist.org/guide/drivers/google_drive)
- [Google Drive API 文档](https://developers.google.com/drive/api/v3/about-sdk)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 授权流程](https://developers.google.com/identity/protocols/oauth2)
