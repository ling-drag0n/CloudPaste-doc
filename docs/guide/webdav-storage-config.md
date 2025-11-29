# WebDAV 存储配置

除了使用 S3 对象存储，CloudPaste 也支持将 **外部 WebDAV 服务** 作为存储后端。

常见场景：

- 已有 NAS / Nextcloud / Cloudreve 等自带 WebDAV 的服务，希望直接复用为 CloudPaste 存储；
- 不方便开 S3，但已有稳定的 WebDAV 服务。

> WebDAV 存储驱动 **不提供直链（DirectLink）能力**，访问路径会通过 CloudPaste 的代理链路或上游 WebDAV。


## 1. 新建 WebDAV 存储配置

1. 登录后台 → **存储配置**。  
2. 点击「新建存储配置」。  
3. 在「存储类型」下拉中选择 **WebDAV**。  
4. 填写基本信息（名称、容量）和连接信息（端点、账号密码等）。  
5. 保存后，在「挂载管理」中为这个存储创建挂载点即可开始使用。

> 建议先用小文件测试上传/列目录，再大规模迁移。


## 2. 字段说明

### 2.1 基本信息

- **配置名称**  
  任意便于识别的名字，例如「家庭 NAS WebDAV」「Nextcloud 存储」。

- **存储容量限制**（可选）  
  - 只影响 CloudPaste 自己的配额计算，不会真的限制远端 WebDAV 的硬盘。  
  - 超出后会触发 CloudPaste 的限额提示，方便避免误占空间。

### 2.2 连接配置

> 这些字段决定 CloudPaste 如何连接你的 WebDAV 服务。

- **WebDAV 端点（endpoint_url）**  
  - 示例：
    - `https://dav.example.com/dav/`
    - `https://nextcloud.example.com/remote.php/dav/files/username/`
  - 要求：
    - 必须包含协议（`http://` 或 `https://`）；
    - 建议以 `/` 结尾，保持路径拼接简单；
    - 填写的就是 WebDAV 根路径 或 某个子目录的根路径。

- **用户名 / 密码**  
  - 对应 WebDAV 服务的登录凭据；
  - 密码会在后端加密存储，测试连接和实际读写时再解密使用；
  - 编辑配置时，密码留空 = 不修改原有密码。

- **默认上传路径（default_folder）**（可选）  
  - 相对于「WebDAV 端点」的子目录。  
  - 写法：不以 `/` 开头，例如：
    - `cloudpaste/`
    - `cloudpaste/files`
  - 不允许包含 `..`，避免路径逃逸；空表示直接使用端点根目录。
  - 最终 WebDAV 实际访问路径为：  
    `endpoint_url` + `default_folder` + CloudPaste 内部路径。

- **TLS 校验证书（tls_insecure_skip_verify）**  
  - 勾选「跳过自签证书校验」时：
    - 如果端点是 `https://` 且证书是自签名/不完整链路，CloudPaste 会忽略证书错误继续连接；
    - 适合内网自签证书环境。  
  - 生产环境建议 **优先修好证书**，不勾选此项。

---

### 2.3 代理 URL（url_proxy，进阶）

> 仅当你已经部署了 [Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js) 等边缘代理时需要考虑，和 S3 的「Proxy URL」语义一致。

- 配置位置：**存储配置 → 高级配置 → 代理 URL**
- 作用：
  - 为 WebDAV 存储指定统一的代理入口域名，例如：`https://proxy.example.com`；
  - 搭配挂载的 WebDAV 策略 `use_proxy_url` 使用时，WebDAV 读文件会重定向到  
    `https://proxy.example.com/proxy/fs/...`。
- 不填时：
  - WebDAV 存储仍然可以正常使用；
  - WebDAV 访问走 `native_proxy` 或 `302_redirect`（取决于挂载 WebDAV 策略）。

关于 WebDAV 策略与代理 URL 的组合，可以参考：[存储 / 挂载通用配置](/guide/storage-common#5-webdav-策略-webdav-policy)。

## 3. 挂载与权限配合

WebDAV 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载；  
2. 选择存储类型为 WebDAV 的那条存储配置；  
3. 填写挂载路径（如 `/webdav`）、备注等；  
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理；  
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护；  
   - **WebDAV 策略**：`native_proxy` / `302_redirect` / `use_proxy_url`。

同时，WebDAV 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储；
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围。

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)  
- [存储 / 挂载通用配置](/guide/storage-common)


## 4. 常见配置示例

### 4.1 自建 WebDAV（如群晖 / 其它 NAS）

1. 在 NAS 上开启 WebDAV 服务，确保可通过浏览器访问：  
   `https://nas.example.com:5006/webdav/`
2. 在 CloudPaste 中新建 WebDAV 存储配置：
   - WebDAV 端点：`https://nas.example.com:5006/webdav/`
   - 用户名 / 密码：NAS 中为 WebDAV 分配的账号；
   - 默认上传路径：`cloudpaste/`（可选）；
   - TLS：若使用自签证书，可临时勾选「跳过自签证书校验」。
3. 创建挂载：挂载路径例如 `/nas`，按需要设置 WebDAV 策略。

### 4.2 Nextcloud / 自建网盘

1. 在 Nextcloud 中找到 WebDAV 地址，例如：  
   `https://nextcloud.example.com/remote.php/dav/files/username/`
2. 在 CloudPaste 中配置：
   - WebDAV 端点：上述地址；
   - 用户名 / 密码：Nextcloud 登录账号；
   - 默认上传路径：如 `cloudpaste/` 或留空；
3. 根据 Nextcloud 性能和带宽情况，选择合适的 WebDAV 策略：
   - 内网 / 小流量：`native_proxy`；
   - 希望通过边缘代理分流：配置 Proxy URL + `use_proxy_url`。

## 5. 常见问题

- **连接失败 / 无法列目录**  
  - 检查端点 URL 是否可在浏览器直接打开（会提示输入 WebDAV 账号密码）；  
  - 检查用户名/密码是否正确；  
  - 如是 https 自签证书，尝试勾选「跳过自签证书校验」。

- **上传失败或速度很慢**  
  - 检查 CloudPaste 与 WebDAV 服务之间的网络延迟和带宽；  
  - 避免将高延迟、公网 WebDAV 用作主存储；  
  - 大量上传建议优先考虑 S3 兼容存储。

- **WebDAV 下载行为与预期不符**  
  - 核对挂载上的 WebDAV 策略是否为 `native_proxy` / `302_redirect` / `use_proxy_url`；  
  - 如启用了 Proxy URL，确认 Cloudpaste-Proxy.js 部署和配置正确。

