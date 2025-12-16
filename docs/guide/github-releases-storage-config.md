# GitHub Releases 存储配置

CloudPaste 支持将 **GitHub Releases** 作为只读存储后端，可将 GitHub 仓库的 Releases 资产映射为虚拟文件系统视图。

## 支持的功能

GitHub Releases 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **DIRECT_LINK**：生成直链下载
- ✅ **PROXY**：代理访问
- ❌ **WRITER**：不支持上传/修改
- ❌ **ATOMIC**：不支持批量操作
- ❌ **MULTIPART**：不支持分片上传

> **注意**：GitHub Releases 存储为**只读**模式，不支持上传、删除或修改任何文件。

## 1. 准备工作

### 1.1 确定目标仓库

1. 确保目标 GitHub 仓库有已发布的 Releases
2. 记录仓库的 `owner`（用户名或组织名）和 `repo`（仓库名）
3. 示例：`ling-drag0n/CloudPaste`

### 1.2 获取访问令牌（可选）

如果需要访问**私有仓库**，需要创建 GitHub Personal Access Token：

1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击「Generate new token」
3. 选择所需权限：
   - `repo`（访问私有仓库）
   - 或 `public_repo`（仅访问公开仓库）
4. 生成并保存令牌

> **公开仓库**无需配置 token 即可访问。

## 2. 新建 GitHub Releases 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **GitHub Releases**
4. 填写配置信息（见下文）
5. 保存后，在「挂载管理」中为这个存储创建挂载点

## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「CloudPaste Releases」「开源项目发布」

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算
  - GitHub Releases 无实际容量限制概念

### 3.2 仓库结构配置

> 这是 GitHub Releases 存储的核心配置

- **仓库结构（repo_structure）** *必填*

  定义要挂载的 GitHub 仓库列表，每行一条配置：

  **支持的格式：**

  | 格式 | 说明 | 示例 |
  |------|------|------|
  | `owner/repo` | 推荐格式，单仓库时直接挂载到根目录 | `ling-drag0n/CloudPaste` |
  | `alias:owner/repo` | 自定义目录名，多仓库时必须使用 | `cloudpaste:ling-drag0n/CloudPaste` |
  | `https://github.com/owner/repo` | 完整 URL 格式 | `https://github.com/ling-drag0n/CloudPaste` |

  **配置规则：**
  - 每行一条配置，空行和以 `#` 开头的行会被忽略
  - **单仓库**：可直接使用 `owner/repo`，文件直接显示在挂载根目录
  - **多仓库**：必须为每行指定别名（`alias:owner/repo`），避免目录冲突

  **示例配置：**

  ```
  # 单仓库配置（直接挂载到根目录）
  ling-drag0n/CloudPaste
  ```

  ```
  # 多仓库配置（每个仓库有独立目录）
  cloudpaste:ling-drag0n/CloudPaste
  vscode:microsoft/vscode
  node:nodejs/node
  ```

### 3.3 显示选项

- **显示所有版本（show_all_version）**（默认关闭）
  - **关闭**：仅显示最新 Release 的资产文件（扁平列表）
  - **开启**：显示所有 Release 版本，每个版本为一个子目录（按 tag_name 命名）

- **显示 README（show_readme）**（默认关闭）
  - 开启后，在仓库目录下显示 `README.md` 和 `LICENSE` 文件
  - 这些文件来自仓库根目录，非 Release 资产

- **显示源代码（show_source_code）**（默认关闭）
  - 开启后，每个 Release 目录下会显示：
    - `Source code (zip)` - 源代码 ZIP 压缩包
    - `Source code (tar.gz)` - 源代码 TAR.GZ 压缩包
  - 这些是 GitHub 自动生成的源代码归档

- **显示 Release Notes（show_release_notes）**（默认关闭）
  - 开启后，每个 Release 目录下会显示 `RELEASE_NOTES.md` 虚拟文件
  - 内容为该 Release 的发布说明（release.body）
  - 仅当 Release 有发布说明时才显示

### 3.4 高级配置

- **GitHub Token（token）**（可选）
  - 用于访问私有仓库的 Personal Access Token
  - 公开仓库无需配置
  - 会在后端加密存储

- **每页数量（per_page）**（默认 20）
  - 获取 Releases 列表时每页的数量
  - 范围：1-100
  - 较大的值可减少 API 请求次数

- **GitHub 代理（gh_proxy）**（可选）
  - 用于加速 GitHub 下载的代理地址
  - 示例：`https://mirror.ghproxy.com/https://github.com` 、`https://ghproxy.com/github.com`

## 4. 目录结构说明

### 4.1 关闭「显示所有版本」（默认）

```
/挂载点/
├── asset1.zip          # 最新 Release 的资产
├── asset2.exe
├── README.md           # 如果开启 show_readme
├── LICENSE
├── Source code (zip)   # 如果开启 show_source_code
├── Source code (tar.gz)
└── RELEASE_NOTES.md    # 如果开启 show_release_notes
```

### 4.2 开启「显示所有版本」

```
/挂载点/
├── v1.0.0/             # Release tag 作为目录名
│   ├── asset1.zip
│   ├── asset2.exe
│   ├── Source code (zip)
│   ├── Source code (tar.gz)
│   └── RELEASE_NOTES.md
├── v0.9.0/
│   └── ...
├── README.md           # 如果开启 show_readme（仓库级）
└── LICENSE
```

### 4.3 多仓库配置

```
/挂载点/
├── cloudpaste/         # 别名作为目录名
│   ├── v1.0.0/
│   └── ...
├── vscode/
│   ├── 1.85.0/
│   └── ...
└── node/
    ├── v20.10.0/
    └── ...
```

## 5. 挂载与权限配合

GitHub Releases 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 GitHub Releases 的那条存储配置
3. 填写挂载路径（如 `/releases`）、备注等
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护
   - **直链策略**：`native_direct` / `proxy`

同时，GitHub Releases 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)

## 6. 常见问题

### 6.1 无法访问私有仓库

**可能原因：**
- 未配置 token
- token 权限不足
- token 已过期

**解决方法：**
1. 创建新的 Personal Access Token
2. 确保有 `repo` 权限
3. 在存储配置中填入 token

### 6.2 Release 列表为空

**可能原因：**
- 仓库没有发布任何 Release
- repo_structure 配置格式错误
- 仓库名或用户名拼写错误

**解决方法：**
1. 确认仓库有已发布的 Release（非 pre-release 或 draft）
2. 检查 repo_structure 格式是否正确
3. 使用完整 URL 格式测试：`https://github.com/owner/repo`

### 6.3 下载速度慢

**可能原因：**
- 网络连接 GitHub 较慢
- 未配置加速代理

**解决方法：**
1. 配置 `gh_proxy` 使用 GitHub 加速镜像
2. 常用镜像：
   - `https://mirror.ghproxy.com`
   - `https://gh.api.99988866.xyz`
3. 或配置挂载的代理策略走本地代理

### 6.4 多仓库配置报错

**错误信息：**
> GitHub Releases 多仓库配置必须为每行指定别名

**解决方法：**
多仓库时必须使用 `alias:owner/repo` 格式：

```
# 错误示例
ling-drag0n/CloudPaste
microsoft/vscode

# 正确示例
cloudpaste:ling-drag0n/CloudPaste
vscode:microsoft/vscode
```

### 6.5 Source code 文件大小显示为 1

**说明：**
- GitHub 的 zipball/tarball URL 不提供准确的文件大小
- CloudPaste 显示为 1 表示"大小未知"
- 实际下载时会获取完整文件

### 6.6 RELEASE_NOTES.md 不显示

**可能原因：**
- 未开启 `show_release_notes` 选项
- 该 Release 没有发布说明（release.body 为空）
- 已有同名的真实资产文件（优先显示真实文件）

**解决方法：**
1. 确认已开启「显示 Release Notes」选项
2. 检查 Release 是否有发布说明内容

## 7. API 速率限制

GitHub API 有请求频率限制：

| 场景 | 限制 |
|------|------|
| 未认证请求 | 60 次/小时 |
| Token 认证请求 | 5000 次/小时 |

**建议：**
- 即使是公开仓库，也建议配置 token 以提高请求限额
- CloudPaste 使用内存缓存减少重复请求
- 缓存 TTL 可通过挂载的 `cache_ttl` 设置（默认 60 秒）

## 8. 参考资源

- [GitHub Releases 文档](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [GitHub REST API - Releases](https://docs.github.com/en/rest/releases/releases)
- [创建 Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
