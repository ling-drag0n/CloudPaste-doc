# 存储 / 挂载通用配置

这一页用来解释存储配置里的 **自定义 HOST/CDN 域名、代理 URL**，以及挂载里的 **Web 代理、签名、WebDAV 策略**，配合 [Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js) 一起看。

## 1. 自定义 HOST / CDN 域名（custom_host）

> 管理后台 → 存储配置 → 编辑 →「高级配置」→ **自定义HOST/CDN域名**

### 它是什么

- 一个指向对象存储的 **自定义域名 / CDN 域名**，例如：`https://cdn.example.com`

### 填了会有什么变化

- 当这一条存储有「直链能力」时，CloudPaste 生成的直链会优先用这里的域名：
  - 不填：`https://s3.xxx.com/bucket/path/file.ext`
  - 填了：`https://cdn.example.com/path/file.ext`
- 只影响「直链访问」（如公开资源、嵌入到别的网站），**不影响代理 URL / WebDAV 策略**。

### 如何使用

- 可以参考 [B2存储反代](/guide/s3-config#如需要反代-b2-私有存储桶-可在-worker-中配置)


## 2. 代理 URL（url_proxy）

> 管理后台 → 存储配置 → 编辑 →「高级配置」→ **代理 URL**

### 它是什么

- 一个指向你 **边缘代理服务** 的域名，例如：`https://proxy.example.com`
- 一般是你部署好的 **[Cloudpaste-Proxy.js](https://github.com/ling-drag0n/CloudPaste/blob/main/Cloudpaste-Proxy.js)（Cloudflare Worker / 其它边缘函数）**。

### 填了会有什么变化

- 对应存储的「最终访问入口」会优先走这个域名，而不是走 CloudPaste 后端：
  - FS 挂载：生成类似  
    `https://proxy.example.com/proxy/fs/<路径>?sign=...`
  - 分享文件：生成类似  
    `https://proxy.example.com/proxy/share/<slug>`
- WebDAV 在策略为 `use_proxy_url` 时，也会重定向到这个域名。

### 和 custom_host 的区别

- `custom_host`：用于「直链」。浏览器或别的网站直接访问存储/CDN。
- `url_proxy`：用于「代理入口」。先打到你的代理，再由代理去访问 CloudPaste / 存储。

简单记：

- (可选)只有 CDN → 填 **自定义 HOST/CDN 域名**(目前仅支持S3)；
- (可选)有自建/Worker 代理 → 填 **代理 URL** (如有反代需求)；
- 两个都不懂 → 两个先都留空，也完全可以正常使用。

## 3. 挂载里的 Web 代理（web_proxy）

> 管理后台 → 挂载管理 → 编辑挂载 → **Web 代理**

### 它是什么

- 控制「这个挂载在 **网页场景**（文件管理、预览、下载）下，文件链接怎么走」：
  - 要不要强制先经过 CloudPaste 自己的 `/api/p` 代理；
  - 同时决定这一挂载下，**存储上的「代理 URL（url_proxy）」在 FS 场景里是否生效**。

### 关闭时（默认）

- 不强制本地代理，按「直链能力 + url_proxy」综合决定：

  - 情况 A：存储**没有**配置「代理 URL（url_proxy）」  
    - 有直链能力 → 优先返回直链（如 custom_host / 预签名）；  
    - 没有直链能力 → 回退到 CloudPaste 本地 `/api/p/...` 代理。

  - 情况 B：存储**配置了**「代理 URL（url_proxy）」  
    - 浏览器拿到的链接会统一变成 `https://proxy.example.com/proxy/fs/...`；  
    - 真实用直链还是 `/api/p`，由代理服务在后台通过 `/api/proxy/link` 再去取，你无需关心。

> 简单理解：web_proxy 关着时，如果你设置了「代理 URL」，网页端就优先走这个代理入口；没设置时才是“能直链就直链，直链不行再回退本地代理”。

### 开启时

- 这个挂载下的 Web 访问会 **强制走 CloudPaste 本地代理**：
  - 前端看到的链接都以 CloudPaste 后端域名开头（`/api/p/...`），**不再改成 url_proxy 域名**；
  - 存储上的「代理 URL（url_proxy）」在 FS 外部链接里会被忽略，只在 `/api/proxy/link` 这条对外协议里使用。

### 什么时候开 / 关

- 若无需求默认即可：**关闭**。

## 4. 签名访问（全局 + 单挂载 enable_sign）

> 管理后台 → 挂载管理 → 编辑挂载 → **启用签名 / 签名有效期**  
> 管理后台 → 系统设置 → **代理 / 签名相关全局配置**

### 它解决什么问题

- 在代理链接上加一个 `?sign=...`，里面带有 **路径 + 过期时间**；
- 签名过期或被篡改时，即使别人拿到了 URL，也无法继续访问。

### 三个层级

1. **全局「签名所有」**：对所有支持代理的挂载统一开启签名；
2. **单挂载「启用签名」**：只给某几个挂载开签名，或覆盖全局过期时间；
3. **过期时间**：
   - `0` 表示永不过期（不推荐对公网资源这么用）；
   - 其它值 = 从生成时刻开始的秒数，到点失效。

### 和密钥的关系

- 后端 `.env` 里的 `ENCRYPTION_SECRET` 是签名密钥；
- Cloudpaste-Proxy.js 中的 `SIGN_SECRET` 必须和它保持一致，边缘代理才能校验 `sign`(不对分享页面生效)。

### 建议

- 公网可访问的下载站：
  - 建议 **启用签名**，过期时间设置 10 分钟 ~ 1 小时；
  - 既能防止长期泄露，也不会频繁失效。

## 5. WebDAV 策略（webdav_policy）

> 管理后台 → 挂载管理 → 编辑挂载 → **WebDAV 策略**

WebDAV 下载文件时有三种模式，决定「文件从哪儿取」。

### 5.1 `native_proxy`（默认，推荐）

- 所有 WebDAV 读写都走 CloudPaste 自己的代理：
  - 不暴露 S3/CDN 域名；
  - 和大部分客户端兼容性最好。
- 代价：带宽都算在 CloudPaste 这一侧。

> 小白用户：**保持默认 `native_proxy` 即可。**

### 5.2 `302_redirect`（直链重定向）

- CloudPaste 尝试让驱动生成一个直链，然后返回 **302 重定向** 到那个地址：
  - 存储支持直链 + 未强制 Web 代理 → 多数情况下跳到 S3/CDN；
  - 部分组合下也可能跳到 `/api/p/...` 的代理地址。
- 优点：大文件可以直接由存储/CDN 承载；
- 注意：部分 WebDAV 客户端对 302 支持不好，需要自己测试。

### 5.3 `use_proxy_url`（走代理 URL / Worker）

- WebDAV 也通过 **代理 URL** 来访问文件：
  - CloudPaste 先生成 `https://proxy.example.com/proxy/fs/...`；
  - 再对客户端返回 302 到这个地址。
- 使用条件：
  - 存储配置里填好了 **代理 URL**；
  - Cloudpaste-Proxy.js 已经部署并能正常访问。
- 如果生成失败，系统会自动降级回 `native_proxy`。


## 6. Cloudpaste-Proxy.js 简要说明

>[!warning]
> ⚠ **建议个人使用，大流量代理可能会受到制裁**

> 文件位置：仓库根目录 `Cloudpaste-Proxy.js`

### 它做什么

- 提供两个统一的代理入口：
  - `GET /proxy/fs/<路径>?sign=...`：FS 文件访问；
  - `GET /proxy/share/<slug>`：分享文件访问。
- 内部流程（简化版）：
  1. 校验 `sign`（如果启用了签名）；
  2. 请求 CloudPaste 后端 `/api/proxy/link` 拿到真正的上游 URL + 需要附带的请求头；
  3. 在边缘环境发起请求，把响应转回给浏览器 / 客户端，并处理好 CORS、重定向等。

### 需要配置的几个值

```js
let ORIGIN = "https://cloudpaste-backend.example.com"; // CloudPaste 后端地址
let TOKEN = "ApiKey xxx";                              // 后台生成的专用 API Key（完整写法）
let SIGN_SECRET = "your-encryption-key";               // 要与 ENCRYPTION_SECRET 一致
let WORKER_BASE = "https://proxy.example.com";         // 这个 Worker 对外地址
```

> CloudPaste 负责“算链接 + 控制权限”，Cloudpaste-Proxy.js 负责“在边缘帮你把流量转出去”。


## 7. 推荐搭配示例

> 以下只是参考，不是唯一正确答案。

### 场景 1：个人/内网用（最简单）

- 存储配置：
  - 只填 Endpoint / Bucket 等必需项；
  - `custom_host`、`url_proxy` 都留空。
- 挂载：
  - Web 代理：关闭；
  - 启用签名：关闭；
  - WebDAV 策略：`native_proxy`。

### 场景 2：公开静态资源（走 CDN 直链，目前仅S3存储可用）

- 存储配置：
  - 配好 `custom_host = https://cdn.example.com`；
  - 不填 代理 URL。
- 挂载：
  - Web 代理：关闭（前端复制出来的是 CDN 直链）；
  - 启用签名：视情况开启或关闭；
  - WebDAV 策略：`native_proxy` 或 `302_redirect`，按客户端表现选择。

### 场景 3：隐藏源站 + 限时访问（推荐给下载站）

- 存储配置：
  - 填 代理 URL：`https://proxy.example.com`；
  - `custom_host` 可选（给内部用）。
- 部署 Cloudpaste-Proxy.js 并正确配置 ORIGIN / TOKEN / SIGN_SECRET / WORKER_BASE。
- 挂载：
  - Web 代理：开启；
  - 启用签名：开启，过期时间设置 600–3600 秒；
  - WebDAV 也希望走代理时，把 WebDAV 策略设为 `use_proxy_url`。

> 不确定怎么选时，可以先按「场景 1」把系统跑起来，再逐步引入代理 URL / 签名等高级功能。
