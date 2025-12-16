# GitHub API 存储配置

CloudPaste 支持将 **GitHub 仓库** 作为可读写的存储后端，通过 GitHub Contents API 和 Git Database API 实现完整的文件 CRUD 操作。

## 支持的功能

GitHub API 存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **DIRECT_LINK**：生成直链下载
- ✅ **PROXY**：代理访问
- ✅ **WRITER**：上传、创建、重命名、删除文件（仅分支模式）
- ✅ **ATOMIC**：原子操作支持（仅分支模式）
- ❌ **MULTIPART**：不支持分片上传

> **注意**：
> - 写入操作（上传/删除/重命名）仅在 `ref` 指向 **分支** 时可用
> - 如果 `ref` 指向 tag 或 commit sha，则为**只读**模式
> - GitHub 单文件上限为 **100MB**

## 1. 准备工作

### 1.1 确定目标仓库

1. 确保你有一个 GitHub 仓库（可以是空仓库）
2. 记录仓库的 `owner`（用户名或组织名）和 `repo`（仓库名）
3. 示例：`ling-drag0n/my-storage`

### 1.2 创建访问令牌

GitHub API 存储需要 Personal Access Token 进行认证：

1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击「Generate new token」
3. 选择所需权限：
   - **只读访问**：`repo`（私有仓库）或 `public_repo`（公开仓库）
   - **读写访问**：`repo`（完整仓库访问权限）
4. 生成并保存令牌

> **重要**：Token 需要 `repo` 权限才能执行写入操作。

## 2. 新建 GitHub API 存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **GitHub API**
4. 填写配置信息（见下文）
5. 保存后，在「挂载管理」中为这个存储创建挂载点

## 3. 字段说明

### 3.1 基本信息

- **配置名称**
  任意便于识别的名字，例如「GitHub 文件存储」「项目资源库」

- **存储容量限制**（可选）
  - 只影响 CloudPaste 自己的配额计算
  - GitHub 仓库本身没有严格的存储限制（但建议保持在 5GB 以内）

### 3.2 仓库配置

> 这是 GitHub API 存储的核心配置

- **仓库拥有者（owner）** *必填*
  - GitHub 用户名或组织名
  - 示例：`ling-drag0n`、`microsoft`

- **仓库名称（repo）** *必填*
  - 目标仓库的名称
  - 示例：`CloudPaste`、`my-storage`

- **访问令牌（token）** *必填*
  - GitHub Personal Access Token
  - 需要 `repo` 权限才能执行写入操作
  - 会在后端加密存储

- **分支/引用（ref）**（可选）
  - 指定要操作的 Git 引用
  - 支持的格式：
    - 分支名：`main`、`master`、`develop`
    - 完整引用：`refs/heads/main`、`heads/main`
    - 标签：`refs/tags/v1.0.0`、`tags/v1.0.0`
    - Commit SHA：`a1b2c3d4...`
  - 留空默认使用仓库的默认分支
  - **注意**：只有分支支持写入操作，tag/commit sha 为只读

### 3.3 高级配置

- **默认上传路径（default_folder）**（可选）
  - 指定文件上传时的默认目标目录
  - 仅影响"文件上传页/分享上传"的默认目录
  - 不影响挂载浏览的根目录
  - 示例：`uploads/`、`assets/files`

- **API 地址（api_base）**（可选）
  - 自定义 GitHub API 端点
  - 默认：`https://api.github.com`
  - 适用于 GitHub Enterprise Server

- **GitHub 代理（gh_proxy）**（可选）
  - 用于加速 `raw.githubusercontent.com` 下载的代理地址
  - 仅对公开仓库的直链生效
  - 示例：`https://mirror.ghproxy.com`

- **提交者名称（committer_name）**（可选）
  - Git 提交时的 Committer 名称
  - 留空使用 GitHub 默认值

- **提交者邮箱（committer_email）**（可选）
  - Git 提交时的 Committer 邮箱
  - 留空使用 GitHub 默认值

- **作者名称（author_name）**（可选）
  - Git 提交时的 Author 名称
  - 留空使用 GitHub 默认值

- **作者邮箱（author_email）**（可选）
  - Git 提交时的 Author 邮箱
  - 留空使用 GitHub 默认值

## 4. 工作原理

### 4.1 读取操作

- 使用 GitHub Contents API 列出目录和获取文件信息
- 公开仓库通过 `raw.githubusercontent.com` 下载文件
- 私有仓库通过 Contents API（带 Token）下载文件

### 4.2 写入操作

GitHub API 存储通过 Git Database API 实现写入：

1. **创建 Blob**：将文件内容编码为 base64 并创建 Git blob
2. **构建 Tree**：基于当前 commit tree 创建新的 tree（包含变更）
3. **创建 Commit**：创建新的 commit 指向新 tree
4. **更新 Ref**：将分支引用指向新 commit

这种方式保证了每次文件操作都会生成一个标准的 Git commit。

### 4.3 空仓库初始化

如果目标仓库为空（无任何 commit）：
- CloudPaste 会自动创建首个 commit
- 在仓库根目录创建 `.gitkeep` 文件作为初始化标记

## 5. 文件大小限制

| 限制类型 | 大小 |
|---------|------|
| 单文件上限 | 100MB |
| 推荐仓库大小 | < 5GB |

> **提示**：如需存储大文件，建议使用 Git LFS 或更换为 S3/OneDrive 等存储类型。

## 6. 挂载与权限配合

GitHub API 存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 GitHub API 的那条存储配置
3. 填写挂载路径（如 `/github`）、备注等
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护
   - **直链策略**：`native_direct` / `proxy`

同时，GitHub API 存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)

## 7. 常见问题

### 7.1 无法写入文件

**可能原因：**
- `ref` 指向 tag 或 commit sha（只读模式）
- Token 权限不足（缺少 `repo` 权限）
- 分支不存在

**解决方法：**
1. 确保 `ref` 指向分支（如 `main`）
2. 检查 Token 是否有 `repo` 权限
3. 确认分支名拼写正确

### 7.2 上传失败：文件过大

**错误信息：**
> 文件过大：GitHub 单文件最大 100MB

**解决方法：**
1. 压缩文件后再上传
2. 将大文件拆分为多个小文件
3. 改用 S3/OneDrive 等支持大文件的存储类型
4. 考虑使用 Git LFS（需要在仓库中配置）

### 7.3 初始化失败：空仓库

**可能原因：**
- 仓库为空且无法解析默认分支

**解决方法：**
1. 在 GitHub 网页上手动创建一个初始文件
2. 或在配置中显式指定 `ref`（如 `main`）

### 7.4 下载速度慢（公开仓库）

**解决方法：**
1. 配置 `gh_proxy` 使用加速镜像
2. 或开启挂载的代理模式

### 7.5 提交记录显示错误的作者

**解决方法：**
1. 在存储配置中设置 `committer_name` 和 `committer_email`
2. 可选设置 `author_name` 和 `author_email`

### 7.6 不支持访问 Git submodule

**说明：**
- GitHub API 存储不支持访问 Git submodule（子模块）
- 尝试访问 submodule 路径会返回错误

**解决方法：**
- 避免在包含 submodule 的仓库中使用该路径
- 或将所需文件直接存放在主仓库中

### 7.7 目录操作失败：trees 响应被截断

**错误信息：**
> GitHub trees 响应被截断（truncated=true）

**可能原因：**
- 目录包含过多文件（超过 GitHub API 单次返回限制）

**解决方法：**
1. 减少单个目录下的文件数量
2. 使用更深的目录结构分散文件

## 8. API 速率限制

GitHub API 有请求频率限制：

| 场景 | 限制 |
|------|------|
| Token 认证请求 | 5000 次/小时 |

**注意事项：**
- 每次文件写入操作会消耗多个 API 请求（blob + tree + commit + ref）
- CloudPaste 内置写入节流机制（默认 1 秒间隔）
- 内置指数退避重试机制处理限流响应

## 9. 与 GitHub Releases 存储的区别

| 特性 | GitHub API | GitHub Releases |
|------|-----------|-----------------|
| 访问内容 | 仓库文件 | Release 资产 |
| 写入支持 | ✅ 支持（分支模式） | ❌ 不支持 |
| 单文件大小 | 100MB | 2GB（GitHub 限制） |
| 适用场景 | 文件存储、配置管理 | 软件发布、版本分发 |

## 10. 参考资源

- [GitHub Contents API](https://docs.github.com/en/rest/repos/contents)
- [GitHub Git Database API](https://docs.github.com/en/rest/git)
- [创建 Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub API 速率限制](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
