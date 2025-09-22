# WebDAV 配置

CloudPaste 提供完整的 WebDAV 协议支持，允许您将文件存储挂载为网络驱动器，实现无缝的文件管理体验。

## WebDAV 简介

WebDAV（Web Distributed Authoring and Versioning）是 HTTP 协议的扩展，允许用户通过网络对文件进行读写操作。

### 主要特性

- 📁 **文件管理**: 创建、删除、重命名文件和文件夹
- 🔄 **同步访问**: 多设备间文件同步
- 🌐 **跨平台**: 支持 Windows、macOS、Linux
- 🔒 **安全访问**: 基于 HTTPS 的安全传输
- 📱 **移动支持**: 支持移动设备客户端

## 访问地址

CloudPaste 的 WebDAV 服务地址格式：

使用后端域名作为地址！！！

```
https://your-domain.com/dav
```

例如：
- `https://paste.example.com/dav`
- `https://cloudpaste-backend.your-username.workers.dev/dav`

## 认证方式

### 1. 管理员账号认证

使用 CloudPaste 的管理员账号：

- **用户名**: `admin`（或您设置的管理员用户名）
- **密码**: 管理员密码

### 2. API 密钥认证

使用专门的 API 密钥，需启用挂载页权限和WEBDAV权限：

- **用户名**: API 密钥的值
- **密码**: API 密钥的值（用户密码相同）

::: tip 推荐
建议为 WebDAV 访问创建专门的 API 密钥，并设置适当的权限范围。
:::

## 使用方式

1. 使用前先确保S3存储已配置存储桶，若要给API密钥用户使用，必须开启对应存储桶的“允许API密钥用户”权限。
2. 配置S3存储后，再去挂载管理中添加对应的驱动进行挂载，这里的路径按照格式任意填写，只是作为挂载路径的标识，和驱动内容无关。
3. 挂载成功后，即可在 WebDAV 客户端中访问并管理文件，格式为 `https://your-domain.com/dav/挂载路径/`。这里的“挂载路径/”对应着就是你的S3存储桶下的根目录路径，若是想细分到文件夹，则填写对应文件夹路径即可 `https://your-domain.com/dav/挂载路径/S3根目录下的子文件夹路径/`。
4. 针对使用API密钥的用户，请确保已启用挂载权限和存储桶的“允许API密钥用户”权限下，界面开启相关的挂载页权限和webdav权限后，即可设置对应密钥基本路径挂载路径（同理映射到WEBDAV路径）。

## 常见问题解决：

1. **连接问题**:

   - 出现405错误，确认 WebDAV URL 格式正确（后端域名作为地址）
   - 验证认证凭据是否有效
   - 检查 API 密钥是否具有挂载权限

2. **权限错误**:

   - 确认账户具有所需的权限
   - 管理员账户应有完整权限
   - API 密钥需特别启用挂载权限

3. **⚠️⚠️ Webdav 上传问题**:

   - 对于 Worker部署， webdav上传 可能受到 Cloudflare 的 Worker 上传限制（100MB左右）
   - 对于 Docker 部署，只需注意 nginx 代理配置，上传模式任意。
   - Windows，Raidrive 等客户端挂载暂不支持拖动上传

## 下一步

- [查看 API 文档](/api/)
- [了解开发指南](/development/)
- [配置 S3 存储](/guide/s3-config)
- [GitHub Actions 部署](/guide/deploy-github-actions)
