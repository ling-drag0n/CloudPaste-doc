# OneDrive 存储配置

CloudPaste 支持将 **Microsoft OneDrive** 作为存储后端，基于 Microsoft Graph API 实现文件操作。

## 支持的功能

OneDrive 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **ATOMIC**：原子操作支持（重命名、复制、批量删除）
- ✅ **PROXY**：代理访问
- ✅ **DIRECT_LINK**：直链下载（通过 Microsoft Graph API）
- ✅ **MULTIPART**：分片上传（断点续传）
- ✅ **PAGED_LIST**：分页目录列表

## 1. 准备工作

### 1.0 可直接按照OpenList配置文档创建(推荐)。

👉  https://doc.oplist.org/guide/drivers/onedrive

<details>
<summary><b>点击展开：若按照OpenList创建，请跳过此步骤</b></summary>

### 1.1 注册 Azure 应用

1. 访问 [Azure 门户](https://portal.azure.com)
2. 进入 **Azure Active Directory** → **应用注册**
3. 点击「新注册」
4. 填写应用信息：
  - **名称**：例如 `CloudPaste OneDrive`
  - **支持的帐户类型**：选择「任何组织目录中的帐户和个人 Microsoft 帐户」
  - **重定向 URI**：选择「Web」，填写 `你的回调地址`

![OneDrive-1](/images/guide/OneDrive/onedrive-1.png)

### 1.2 配置 API 权限

1. 进入应用详情页 → **API 权限**
2. 点击「添加权限」→ 选择「Microsoft Graph」
3. 选择「委托的权限」，添加以下权限：
  - `Files.ReadWrite`
  - `Files.ReadWrite.All`
4. 点击「授予管理员同意」（如果是组织账户）

![OneDrive-3](/images/guide/OneDrive/onedrive-3.png)

### 1.3 创建客户端密钥

1. 进入应用详情页 → **证书和密码**
2. 点击「新客户端密码」
3. 填写描述和过期时间
4. **立即复制密钥值**（离开页面后将无法再次查看）

![OneDrive-2](/images/guide/OneDrive/onedrive-2.png)

### 1.4 获取应用信息

在应用详情页的「概述」中记录：
- **应用程序（客户端）ID**：即 `client_id`
- **客户端密钥值**：即 `client_secret`（上一步创建的）

![OneDrive-4](/images/guide/OneDrive/onedrive-4.png)
![OneDrive-5](/images/guide/OneDrive/onedrive-5.png)

### 1.5 获取 Refresh Token

#### 使用第三方工具

可以使用 [OneDrive Token 获取工具](https://api.oplist.org/) 等第三方工具简化获取流程。

</details>

## 2. 新建 OneDrive 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **OneDrive**
4. 填写配置信息（见下文）
5. 保存后，在「挂载管理」中为这个存储创建挂载点

## 3. 字段说明

### 3.1 基本信息

- **配置名称**  
  任意便于识别的名字，例如「个人 OneDrive」「团队 OneDrive」

- **存储容量限制**（可选）  
  - 只影响 CloudPaste 自己的配额计算
  - 超出后会触发 CloudPaste 的限额提示

### 3.2 认证配置

> 这些字段决定 CloudPaste 如何连接你的 OneDrive

- **区域（region）**  
  - 选项：
    - `global`：全球版（默认）
    - `cn`：中国版（世纪互联）
    - `us`：美国政府版
    - `de`：德国版
  - 不同区域使用不同的 OAuth 和 Graph API 端点

- **客户端 ID（client_id）** *必填*  
  - Azure 应用的「应用程序（客户端）ID」
  - 示例：`12345678-1234-1234-1234-123456789012`

- **客户端密钥（client_secret）** *必填*  
  - Azure 应用的客户端密钥值
  - 会在后端加密存储
  - 编辑配置时，密码留空 = 不修改原有密码

- **刷新令牌（refresh_token）** *必填*  
  - OAuth 2.0 刷新令牌
  - 用于自动获取和刷新访问令牌
  - 会在后端加密存储

- **重定向 URI（redirect_uri）**（可选）  
  - OAuth 授权时使用的重定向地址
  - 必须与 Azure 应用中配置的重定向 URI 一致
  - 示例：`http://localhost` 或 `https://your-domain.com/callback`

### 3.3 高级配置

- **Token 续期端点（token_renew_endpoint）**（可选）  
  - 自定义 token 刷新服务的 URL
  - 如果不填，将直接使用微软官方 OAuth 端点
  - 适用场景：使用第三方 token 管理服务（如 OneDrive Online API）

- **使用 Online API（use_online_api）**（可选）  
  - 勾选后，将使用 Online API 协议调用 token 续期端点
  - 仅在配置了 `token_renew_endpoint` 时生效

- **默认上传路径（default_folder）**（可选）  
  - 相对于 OneDrive 根目录的子目录
  - 写法：不以 `/` 开头，例如：
    - `cloudpaste/`
    - `cloudpaste/files`
  - 空表示直接使用根目录

- **代理 URL（url_proxy）**（可选）  
  - 为 OneDrive 存储指定统一的代理入口域名
  - 示例：`https://proxy.example.com`
  - 配合挂载的代理策略使用

## 5. 挂载与权限配合

OneDrive 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 OneDrive 的那条存储配置
3. 填写挂载路径（如 `/onedrive`）、备注等
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护
   - **直链策略**：`native_direct` / `proxy` / `use_proxy_url`

同时，OneDrive 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

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
- Azure 应用权限未正确配置
- 区域选择错误（如中国版应选择 `cn`）

**解决方法：**
1. 检查 Azure 应用配置是否正确
2. 重新获取 refresh_token
3. 确认 API 权限已授予并同意
4. 检查区域设置是否匹配

### 6.2 上传失败或速度很慢

**可能原因：**
- 网络延迟较高
- OneDrive API 限流
- 文件过大

**解决方法：**
1. 检查 CloudPaste 与 OneDrive 之间的网络连接
2. 大文件上传请使用分片上传
3. 如遇到限流，稍后重试

### 6.3 Refresh Token 过期

**现象：**
- 提示「无法获取访问令牌」
- 日志显示「invalid_grant」错误

**解决方法：**
1. Refresh token 可能因长时间未使用而失效
2. 重新执行授权流程获取新的 refresh_token
3. 在 CloudPaste 中更新存储配置

### 6.4 文件下载行为与预期不符

**检查项：**
1. 核对挂载上的直链策略是否为 `native_direct` / `proxy` / `use_proxy_url`
2. 如启用了 Proxy URL，确认代理服务部署和配置正确
3. OneDrive 的 downloadUrl 有效期约 1 小时，过期后会自动刷新

## 7. 参考资源

- [OpenList](https://doc.oplist.org/guide/drivers/onedrive)
- [Microsoft Graph API 文档](https://docs.microsoft.com/zh-cn/graph/api/overview)
- [OneDrive API 参考](https://docs.microsoft.com/zh-cn/graph/api/resources/onedrive)
- [Azure 应用注册指南](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/quickstart-register-app)
- [OAuth 2.0 授权码流程](https://docs.microsoft.com/zh-cn/azure/active-directory/develop/v2-oauth2-auth-code-flow)
