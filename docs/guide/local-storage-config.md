# 本地存储配置

CloudPaste 支持将 **本地文件系统** 作为存储后端，适用于 Node.js / Docker 部署环境。

## 支持的功能

本地存储驱动支持以下能力：

- ✅ **READER**：读取文件和目录
- ✅ **WRITER**：上传、创建、重命名、删除文件
- ✅ **ATOMIC**：原子操作支持（重命名、复制、批量删除）
- ✅ **PROXY**：代理访问

> **注意**：本地存储不支持 DIRECT_LINK（直链）、MULTIPART（分片上传）和 PAGED_LIST（分页列表）能力。

## 1. 适用场景

### 1.1 推荐场景

- **自托管部署**：使用 Docker 或 Node.js 直接部署在自己的服务器上
- **内网环境**：不需要依赖外部云存储服务
- **开发测试**：快速搭建测试环境
- **小规模应用**：文件量不大，单机存储足够

### 1.2 不适用场景

- ❌ **Cloudflare Workers 部署**：Workers 环境无法访问本地文件系统
- ❌ **无服务器环境**：Serverless 环境通常不提供持久化文件系统
- ❌ **分布式部署**：多实例部署时无法共享本地存储

## 2. 新建本地存储配置

1. 登录 CloudPaste 后台 → **存储配置**
2. 点击「新建存储配置」
3. 在「存储类型」下拉中选择 **LOCAL**
4. 填写配置信息（见下文）
5. 保存后，在「挂载管理」中为这个存储创建挂载点

## 3. 字段说明

### 3.1 基本信息

- **配置名称**  
  任意便于识别的名字，例如「本地存储」「服务器磁盘」

- **存储容量限制**（可选）  
  - 只影响 CloudPaste 自己的配额计算
  - 超出后会触发 CloudPaste 的限额提示
  - 不会真正限制宿主机的磁盘空间

### 3.2 路径配置

- **根目录路径（root_path）** *必填*  
  - 本地文件系统的绝对路径，作为存储的根目录
  - 必须是绝对路径，例如：
    - Linux/Mac: `/data/cloudpaste/storage`
    - Windows: `D:\cloudpaste\storage`
  - 所有文件操作都限制在此目录内（监狱机制）
  - 路径必须已存在且可读写（除非启用 `auto_create_root`）

- **自动创建根目录（auto_create_root）**（可选）  
  - 默认：`false`（关闭）
  - 勾选后：如果 `root_path` 不存在，系统会自动创建
  - 不勾选：必须手动在宿主机上创建目录

### 3.3 权限配置

- **目录/文件权限（dir_permission）**（可选）  
  - 八进制权限值，例如：`0755`、`0777`
  - 默认：`0777`（所有用户可读写执行）
  - 同时应用于目录和文件
  - 适用场景：单机自托管，通常使用默认值即可

### 3.4 高级配置

- **只读模式（readonly）**（可选）  
  - 默认：`false`（允许读写）
  - 勾选后：禁止所有写入和删除操作
  - 适用场景：只读挂载、归档存储

- **回收站路径（trash_path）**（可选）  
  - 删除文件时移动到回收站而非永久删除
  - 支持相对路径（相对于 `root_path`）或绝对路径
  - 示例：
    - 相对路径：`.trash`（在 root_path 下创建 .trash 目录）
    - 绝对路径：`/data/cloudpaste/trash`
  - 不配置时：删除操作为永久删除

## 4. 挂载与权限配合

本地存储配置保存后，需要在「挂载管理」中为其创建挂载点：

1. 进入 **挂载管理** → 新建挂载
2. 选择存储类型为 LOCAL 的那条存储配置
3. 填写挂载路径（如 `/local`）、备注等
4. 视情况开启：
   - **Web 代理**：是否强制 Web 场景走 CloudPaste 代理
   - **启用签名**：是否对 `/api/p` / 代理入口签名保护

同时，本地存储配置中有一个 **允许 API 密钥使用（is_public）** 选项：

- 勾选后，API 密钥可以在其「挂载路径」范围内使用该存储
- 配合 API 密钥的 basic_path 和挂载路径，可以精确限制访问范围

详细的挂载与权限说明，可参考：

- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)

## 5. 安全机制

### 5.1 路径监狱（Path Jail）

- 所有文件操作严格限制在 `root_path` 目录内
- 自动检测并阻止路径越界（`../` 等）
- 符号链接（symlink）安全检查：
  - 检测符号链接是否指向 `root_path` 之外
  - 阻止通过符号链接逃逸到其他目录

### 5.2 权限控制

- 初始化时检查 `root_path` 的读写权限
- 只读模式下禁止所有写入操作
- 文件和目录权限可配置

### 5.3 回收站机制

- 配置回收站后，删除操作变为移动到回收站
- 文件名自动添加时间戳避免冲突
- 支持跨文件系统移动（自动降级为复制+删除）

## 6. 常见问题

### 6.1 初始化失败：root_path 不存在

**错误信息**：
```
LOCAL 驱动 root_path 不存在，请先在宿主机上手动创建该目录
```

**解决方法**：
1. 在宿主机上手动创建目录：`mkdir -p /data/cloudpaste/storage`
2. 或者勾选「自动创建根目录」选项

### 6.2 权限错误：root_path 不可写

**错误信息**：
```
LOCAL 驱动 root_path 不可写
```

**解决方法**：
1. 检查目录权限：`ls -la /data/cloudpaste/`
2. 修改权限：`chmod 755 /data/cloudpaste/storage`
3. 检查目录所有者：`chown -R user:group /data/cloudpaste/storage`

### 6.3 Docker 容器内无法访问

**可能原因**：
- 未正确挂载 volume
- 容器内路径与配置不一致
- 权限问题

**解决方法**：
1. 检查 docker-compose.yml 中的 volumes 配置
2. 确认容器内路径：`docker exec -it container_name ls -la /data/storage`
3. 检查宿主机目录权限

### 6.4 符号链接被拒绝访问

**错误信息**：
```
符号链接指向 root_path 之外，已被禁止访问
```

**原因**：
- 安全机制阻止符号链接逃逸到 `root_path` 之外

**解决方法**：
- 将符号链接目标移动到 `root_path` 内
- 或者使用硬链接/直接复制文件

### 6.5 Cloudflare Workers 部署无法使用

**错误信息**：
```
LOCAL 驱动仅在 Node/Docker 环境可用
```

**原因**：
- Workers 环境无法访问本地文件系统

**解决方法**：
- 使用 S3、WebDAV 或 OneDrive 等云存储
- 或者切换到 Node.js / Docker 部署方式

## 7. 性能优化建议

### 7.1 磁盘选择

- **SSD 优先**：读写性能更好
- **避免网络磁盘**：NFS/CIFS 会增加延迟
- **RAID 配置**：根据需求选择 RAID 级别

### 7.2 目录结构

- 避免单个目录下文件过多（建议 < 10000）
- 使用合理的子目录结构
- 定期清理回收站

### 7.3 权限配置

- 生产环境建议使用 `0755` 而非 `0777`
- 确保 CloudPaste 进程有足够权限
- 避免使用 root 用户运行

## 8. 监控与维护

### 8.1 磁盘空间监控

```bash
# 检查磁盘使用情况
df -h /data/cloudpaste/storage

# 检查目录大小
du -sh /data/cloudpaste/storage
```

### 8.2 回收站清理

```bash
# 查看回收站大小
du -sh /data/cloudpaste/storage/.trash

# 清理 30 天前的文件
find /data/cloudpaste/storage/.trash -type f -mtime +30 -delete
```

### 8.3 备份建议

- 定期备份 `root_path` 目录
- 使用 rsync、tar 等工具
- 考虑增量备份策略

## 9. 参考资源

- [Docker 部署指南](/guide/deploy-docker)
- [挂载管理使用指南](/guide/mount-management)
- [存储 / 挂载通用配置](/guide/storage-common)
