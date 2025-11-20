# 密钥管理使用指南

创建、分配、限制和回收 API 密钥，控制访问范围与权限位。


## 1. 能做什么
- **生成密钥**：自定义名称/密钥值（或系统随机），设置有效期、启用状态。
- **权限位控制**：按位授权文本/文件/挂载/WebDAV 能力。
- **路径范围**：`basic_path` 限制密钥可访问的虚拟路径前缀。
- **存储 ACL（可选）**：限定可用存储配置。
- **游客密钥**：角色 `GUEST`（系统只允许 1 个），便于公开/匿名访问。


## 2. 创建密钥
1) 后台 → **密钥管理** → “新建密钥”。  
2) 填写：  
   - **名称**（必填，唯一）  
   - **密钥值**（可选；空则系统随机 12 位；GUEST 固定 guest/guest）  
   - **角色**：`GENERAL` 默认；`GUEST` 仅允许一条，且名称固定 guest。  
   - **有效期**：默认为 1 天；可选“永不过期”。  
   - **启用**：默认未启用，需显式勾选。  
   - **basic_path**：限制访问路径前缀，默认 `/` 全局。  
   - **权限位**：按需勾选（见下）。  
   - **存储 ACL**（可选）：勾选可使用的存储配置，仅对存储相关权限生效。  
3) 保存后可在列表复制完整密钥或掩码查看。

## 3. 权限位速查
- 文本：`TEXT_SHARE`（创建/分享文本）、`TEXT_MANAGE`（管理自己的文本）。  
- 文件：`FILE_SHARE`、`FILE_MANAGE`。  
- 挂载：`MOUNT_VIEW`/`UPLOAD`/`COPY`/`RENAME`/`DELETE`。  
- WebDAV：`WEBDAV_READ`、`WEBDAV_MANAGE`。  
> 勾选越少越安全；缺少对应位即阻断相应操作。


## 4. 使用与验证
- **客户端使用**：在请求头 `Authorization: ApiKey <key>`，或 `X-Custom-Auth-Key`。WebDAV 可用 Basic（user=key, pass=key）。  
- **basic_path 生效规则**：请求路径必须位于 `basic_path` 之下，否则拒绝。  
- **测试接口**：`GET /api/test/api-key` 返回当前密钥权限概览。  
- **游客配置获取**：`/api/public/guest-config`（若启用 GUEST key）。


## 5. 编辑与禁用
- 可修改名称、权限、basic_path、有效期、启用状态、存储 ACL。  
- 禁用后密钥立即不可用；可再启用。


## 6. 常见场景
- **分角色授权**：为“只上传”场景仅勾 `FILE_SHARE` + `basic_path=/upload`。  
- **访客浏览**：创建唯一 GUEST 密钥，给最小权限（如 `TEXT_SHARE` + `basic_path=/public`）。  
- **WebDAV 专用**：勾 `WEBDAV_READ/WEBDAV_MANAGE` + 挂载权限位，限制 basic_path 到指定挂载。  
- **按存储限权**：结合存储 ACL，只允许访问特定存储配置。


## 7. 故障排查
- 403/无权限：检查权限位、basic_path、启用状态。  
- 密钥无效/过期：查看有效期或是否被自动清理。  
- GUEST 创建失败：系统已存在 GUEST；需先删除或禁用原有。  
- 看不到存储：存储 ACL 未勾选或挂载权限不足。