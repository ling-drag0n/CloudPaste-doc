# HuggingFace 存储配置

CloudPaste 支持将 **HuggingFace Datasets** 作为存储后端，通过 HuggingFace Hub API 实现文件的上传、下载和管理。

常见场景：

- 利用 HuggingFace 的免费存储空间托管文件；
- 已有 HuggingFace 数据集仓库，希望直接复用；
- 需要一个支持大文件（LFS）的免费存储方案。

> HuggingFace 存储驱动支持 **直链（DirectLink）能力**，公开仓库的文件可以直接通过 HuggingFace CDN 访问。私有/受限仓库需要通过 CloudPaste 代理访问。


## 支持的功能

HuggingFace 存储驱动支持以下能力：

**基础能力（始终可用）**：
- ✅ **READER**：读取文件和目录
- ✅ **DIRECT_LINK**：直链下载（仅公开仓库）
- ✅ **PROXY**：代理访问（私有仓库必需）
- ✅ **PAGED_LIST**：分页目录列表（基于 HuggingFace Hub API 原生分页）

**写入能力（需要 Token 且使用分支）**：
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **MULTIPART**：分片上传（大文件，支持断点续传）
- ✅ **ATOMIC**：原子操作支持（重命名、复制、批量删除）

> **注意**：
> - 写入相关能力（WRITER、MULTIPART、ATOMIC）需要配置 HuggingFace Token 并拥有相应权限
> - 私有/受限（gated）仓库的所有操作都需要 Token
> - 使用 commit SHA 作为 revision 时为只读模式（仅基础能力可用）


## 1. 准备工作

### 1.1 注册 HuggingFace 账号

1. 访问 [HuggingFace](https://huggingface.co) 并注册账号
2. 完成邮箱验证

### 1.2 创建 Dataset 仓库

1. 登录 HuggingFace 后，点击右上角头像 → **New Dataset**
2. 填写仓库信息：
   - **Owner**：选择你的用户名或组织
   - **Dataset name**：仓库名称，例如 `my-cloudpaste-storage`
   - **License**：选择合适的许可证（可选）
   - **Visibility**：选择 **Public**（公开）或 **Private**（私有）
3. 点击 **Create dataset** 创建仓库

> **公开 vs 私有仓库**：
> - **公开仓库**：任何人都可以访问，支持直链下载
> - **私有仓库**：仅授权用户可访问，必须通过 CloudPaste 代理

### 1.3 获取 Access Token

如果需要写入操作或访问私有仓库，需要创建 Access Token：

1. 点击右上角头像 → **Settings** → **Access Tokens**
2. 点击 **New token**
3. 配置 Token：
   - **Token name**：便于识别的名称，如 `cloudpaste-storage`
   - **Token type**：选择 **Fine-grained** 或 **Write**
   - **Permissions**：
     - 只读访问：勾选 `Read access to contents of all repos under your personal namespace`
     - 读写访问：勾选 `Read and write access to contents of all repos under your personal namespace`
       ![hug-1](/images/guide/huggingface/hug-1.png)
4. 点击 **Create token**
5. **立即复制并保存 Token**，页面刷新后将无法再次查看

> **安全提示**：Token 相当于密码，请勿泄露给他人。建议使用 Fine-grained Token 并仅授予必要权限。


## 2. 新建 HuggingFace 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **HuggingFace Datasets**
4. 填写配置信息（见下文字段说明）
5. 点击「测试连接」验证配置是否正确
6. 保存后，在「挂载管理」中为这个存储创建挂载点

> 建议先用小文件测试上传/下载，确认功能正常后再大规模使用。


## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「HuggingFace 文件存储」「HF 数据集备份」。

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算，不会真的限制 HuggingFace 存储。
  - HuggingFace 官方存储限制见下文「存储限制」章节。

### 3.2 HuggingFace 配置

> 这是 HuggingFace 存储的核心配置

- **数据集仓库（repo）** *必填*
  - 格式：`用户名/仓库名` 或 `组织名/仓库名`
  - 示例：`username/my-dataset`、`my-org/shared-files`
  - 必须是已存在的 Dataset 类型仓库

- **Access Token（hf_token）**（可选）
  - 从 HuggingFace Settings 获取的 Access Token
  - 格式：`hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - 会在后端加密存储
  - **何时需要**：
    - 访问私有/受限仓库
    - 执行写入操作（上传、删除、重命名等）

- **分支/标签（revision）**（可选）
  - 指定要使用的分支、标签或 commit SHA
  - 默认：`main`
  - **注意**：使用 commit SHA 时为只读模式

### 3.3 高级配置

- **Hub 端点（endpoint_base）**（可选）
  - 自定义 HuggingFace Hub API 端点
  - 默认：`https://huggingface.co`
  - 用于自建 HuggingFace Hub 镜像或企业版场景

- **默认上传路径（default_folder）**（可选）
  - 相对于仓库根目录的子目录
  - 写法：不以 `/` 开头，例如：`cloudpaste/` 或 `files/uploads`
  - 空表示直接使用仓库根目录

- **启用详细文件信息（hf_use_paths_info）**（可选）
  - 开启后会获取文件的修改时间、LFS/Xet 状态等详细信息
  - 默认：关闭
  - 开启会增加 API 调用次数，可能影响性能

- **目录列表分页数（hf_tree_limit）**（可选）
  - 每页返回的文件/目录数量
  - 默认：使用 HuggingFace 默认值
  - 较大的值可减少分页请求，但单次响应更大

- **分片上传并发数（hf_multipart_concurrency）**（可选）
  - 同时进行的分片上传数量
  - 默认：3
  - 较高的并发可能触发 API 限流

- **使用 Xet 存储（hf_use_xet）**（可选）
  - 启用 HuggingFace 的 Xet 存储后端
  - 默认：关闭
  - 仅在仓库启用了 Xet 功能时有效

- **删除时清理 LFS 对象（hf_delete_lfs_on_remove）**（可选）
  - 删除文件时同时删除底层的 LFS 对象
  - 默认：关闭
  - **⚠️ 危险操作**：开启后会永久删除 LFS 数据，影响仓库历史


## 4. 工作原理

### 4.1 存储架构

HuggingFace Datasets 本质上是一个 Git 仓库，支持 Git LFS（Large File Storage）：

```
HuggingFace Dataset Repository
├── .gitattributes          # LFS 配置
├── README.md               # 仓库说明
├── data/                   # 数据目录
│   ├── file1.txt          # 小文件（直接存储）
│   └── large_file.zip     # 大文件（LFS 存储）
└── ...
```

### 4.2 文件存储方式

HuggingFace 使用 Git LFS 存储大文件。根据 `.gitattributes` 配置，符合特定模式的文件会自动使用 LFS 存储。

| 文件类型 | 存储方式 | 说明 |
|----------|----------|------|
| 小文件 | Git 直接存储 | 存储在 Git 仓库中 |
| 大文件 | Git LFS | 存储在 HuggingFace LFS 服务器 |

> **注意**：LFS 的触发取决于仓库的 `.gitattributes` 配置，而非固定的文件大小阈值。

### 4.3 上传流程

**小文件上传**：
1. CloudPaste 调用 HuggingFace Commit API
2. 文件内容直接写入仓库
3. 创建新的 commit

**大文件上传（LFS）**：
1. 前端计算文件 SHA256 哈希
2. 请求 LFS 上传凭证
3. 分片上传到 LFS 服务器
4. 创建 LFS 指针文件并 commit

### 4.4 下载流程

**公开仓库**：
1. 生成 `/resolve/` 直链 URL
2. 浏览器直接从 HuggingFace CDN 下载

**私有仓库**：
1. CloudPaste 代理请求
2. 使用 Token 认证获取文件
3. 流式返回给客户端


## 5. 挂载与权限配合

HuggingFace 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 HuggingFace Datasets 的那条存储配置
3. 填写挂载路径（如 `/huggingface`）、备注等
4. 视情况开启：
   - **Web 代理**：私有仓库必须开启，公开仓库可选
   - **启用签名**：是否对代理入口签名保护

同时，HuggingFace 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)


## 6. 常见问题

### 6.1 测试连接失败：仓库不存在或无权访问

**错误信息：**
> HuggingFace 测试失败：仓库不存在或无权访问

**可能原因：**
- 仓库名称格式错误
- 仓库不存在
- 私有仓库未配置 Token

**解决方法：**
1. 检查仓库名称格式是否为 `用户名/仓库名`
2. 在 HuggingFace 网站确认仓库存在
3. 如果是私有仓库，确保已配置有效的 Access Token

### 6.2 测试连接失败：Token 无效或权限不足

**错误信息：**
> HuggingFace 测试失败：Token 无效或权限不足

**可能原因：**
- Token 已过期或被撤销
- Token 权限不足

**解决方法：**
1. 在 HuggingFace Settings 检查 Token 状态
2. 确认 Token 拥有访问该仓库的权限
3. 如有必要，重新创建 Token

### 6.3 上传失败：无写入权限

**错误信息：**
> 无法写入：当前配置为只读模式

**可能原因：**
- 未配置 Token
- Token 没有写入权限
- 使用了 commit SHA 作为 revision

**解决方法：**
1. 配置具有写入权限的 Token
2. 如果使用 commit SHA，改为使用分支名（如 `main`）

### 6.4 上传大文件失败

**可能原因：**
- 网络不稳定导致分片上传中断
- 触发了 HuggingFace API 限流

**解决方法：**
1. 检查网络连接稳定性
2. 降低 `hf_multipart_concurrency` 并发数
3. 等待几分钟后重试

### 6.5 私有仓库文件无法直接访问

**说明：**
这是预期行为。私有仓库的文件必须通过 CloudPaste 代理访问。

**解决方法：**
1. 确保挂载配置中开启了「Web 代理」
2. 通过 CloudPaste 的代理链接访问文件

### 6.6 频繁出现 429 错误（限流）

**可能原因：**
- 短时间内请求过于频繁
- 开启了 `hf_use_paths_info` 导致额外 API 调用

**解决方法：**
1. 关闭 `hf_use_paths_info` 选项
2. 降低 `hf_multipart_concurrency` 并发数
3. 避免频繁刷新目录列表
4. 等待几分钟后重试


## 7. 存储限制

::: warning 重要
以下信息基于 HuggingFace 官方文档（2024年12月），实际限制可能会调整，请以 [官方文档](https://huggingface.co/docs/hub/storage-limits) 为准。
:::

### 7.1 账户存储限制

| 账户类型 | 公开存储 | 私有存储 |
|----------|----------|----------|
| 免费用户/组织 | 尽力而为*（高影响力工作通常可达 5TB） | **100GB** |
| PRO 用户（$9/月） | 最高 10TB* | **1TB** + 按需付费 |
| Team 组织（$20/用户/月） | 12TB 基础 + 1TB/席位 | 1TB/席位 + 按需付费 |
| Enterprise（$50+/用户/月） | 500TB 基础 + 1TB/席位 | 1TB/席位 + 按需付费 |

> \* **关于公开存储**：HuggingFace 致力于为 AI 社区提供慷慨的免费公开存储空间。超过最初几 GB 后，请负责任地使用此资源，上传对其他用户有真正价值的内容。如需大量存储空间，需要升级到 PRO、Team 或 Enterprise。

### 7.2 仓库限制

| 特性 | 推荐值 | 硬限制 | 说明 |
|------|--------|--------|------|
| 单文件大小 | **< 50GB** | **500GB** | 建议分割为更小的分块文件 |
| 每仓库文件数 | **< 100k** | - | 合并数据到更少文件 |
| 每文件夹条目数 | **< 10k** | - | 使用子目录组织 |
| 每次提交文件数 | **< 100** | - | 分多次提交上传 |

### 7.3 私有存储按需付费

超出免费额度后，私有存储按 **$25/TB/月** 计费（以 1TB 为单位递增）。


## 8. 参考资源

- [HuggingFace Hub 文档](https://huggingface.co/docs/hub)
- [HuggingFace 存储限制](https://huggingface.co/docs/hub/storage-limits)
- [HuggingFace Datasets 文档](https://huggingface.co/docs/datasets)
- [HuggingFace Access Tokens](https://huggingface.co/settings/tokens)
- [HuggingFace 定价](https://huggingface.co/pricing)
- [Git LFS 文档](https://git-lfs.github.com/)
