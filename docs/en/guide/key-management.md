# API Key Management Guide

Create, assign, restrict, and revoke API keys to control access scope and permission bits.

## 1. Key Features
- **Generate Keys**: Customize names/key values (or use system-generated), set expiration dates, and enable/disable status.
- **Permission Bit Control**: Grant text/file/mount/WebDAV capabilities via bitwise authorization.
- **Path Scope**: Restrict accessible virtual path prefixes using `basic_path`.
- **Storage ACL (Optional)**: Limit usable storage configurations.
- **Guest Keys**: Role `GUEST` (system allows only 1) for public/anonymous access.

## 2. Create a Key
1) Admin panel → **Key Management** → "New Key".
2) Fill in:
   - **Name** (required, unique)
   - **Key Value** (optional; leave blank for 12-digit system-generated; GUEST fixed as guest/guest)
   - **Role**: `GENERAL` (default); `GUEST` (only one allowed, name fixed as guest).
   - **Expiration**: Default 1 day; optional "Never Expires".
   - **Enable**: Disabled by default; requires explicit check.
   - **basic_path**: Restrict path prefix access; default `/` (global).
   - **Permission Bits**: Select as needed (see below).
   - **Storage ACL** (optional): Select allowed storage configurations; applies only to storage-related permissions.
3) After saving, copy the full key or masked view from the list.

## 3. Permission Bit Reference
- Text: `TEXT_SHARE` (create/share text), `TEXT_MANAGE` (manage own text).
- File: `FILE_SHARE`, `FILE_MANAGE`.
- Mount: `MOUNT_VIEW`/`UPLOAD`/`COPY`/`RENAME`/`DELETE`.
- WebDAV: `WEBDAV_READ`, `WEBDAV_MANAGE`.
> Fewer selections = higher security; missing bits block corresponding operations.

## 4. Usage & Verification
- **Client Usage**: Include in request header as `Authorization: ApiKey <key>` or `X-Custom-Auth-Key`. For WebDAV, use Basic Auth (user=key, pass=key).
- **basic_path Rule**: Request path must be under `basic_path`; otherwise denied.
- **Test Endpoint**: `GET /api/test/api-key` returns current key permission overview.
- **Guest Config**: `/api/public/guest-config` (if GUEST key is enabled).

## 5. Edit & Disable
- Modify name, permissions, `basic_path`, expiration, enable/disable status, or storage ACL.
- Disabled keys become immediately unusable; can be re-enabled.

## 6. Common Scenarios
- **Role-Based Access**: For "upload-only" cases, enable only `FILE_SHARE` + `basic_path=/upload`.
- **Guest Browsing**: Create a single GUEST key with minimal permissions (e.g., `TEXT_SHARE` + `basic_path=/public`).
- **WebDAV Dedication**: Enable `WEBDAV_READ/WEBDAV_MANAGE` + mount bits, restrict `basic_path` to specific mounts.
- **Storage-Specific Access**: Combine with storage ACL to limit access to designated storage configurations.

## 7. Troubleshooting
- 403/No Permission: Check permission bits, `basic_path`, and enable status.
- Invalid/Expired Key: Verify expiration or automatic cleanup.
- GUEST Creation Failed: System already has a GUEST key; delete/disable the existing one first.
- Missing Storage: Storage ACL unchecked or insufficient mount permissions.