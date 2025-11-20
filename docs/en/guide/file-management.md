# File Management Guide

Manage shared files, generate direct/proxy links, and set passwords/expiration/access limits.


## 1. Key Features
- **Upload & Share**: Generate slugs, direct/proxy links, and QR codes via the "Upload" page or backend file management.
- **Security Controls**: Optional password, expiration time, and max views; toggle between proxy/direct links.
- **View & Preview**: Public/private file pages, raw downloads, and Office online preview (supports signed direct/proxy links).
- **Management**: List/search, batch delete (with optional storage object removal), and update metadata (notes, password, expiration, views, proxy toggle).


## 2. Create & Upload
1) Go to the frontend "Upload" page or backend "File Management."
2) Select storage (defaults to current storage) and upload files.
3) Optional settings:
   - **Slug**: Custom short URL (must be unique; alphanumeric/`-`/`_`/`.` allowed).
   - **Password**: Access requires a password; proxy links auto-include `password` for easy sharing.
   - **Expiration**: Auto-deletes after expiry.
   - **Max Views**: Auto-deletes after limit.
   - **Proxy Toggle**: Enable to hide origin links via backend signing.
4) After submission, get: preview link, download link, proxy link, QR code.


## 3. Access Methods
- **Public/Private Page**: `/file/{slug}` (public) or restricted backend view.
- **Raw Download/Preview**: `/api/file-download/{slug}`, `/api/file-view/{slug}`; add `password` query param if required.
- **Office Preview**: `/api/office-preview/{slug}` (generates one-time/signed direct/proxy links).
- **Proxy vs. Direct**: Proxy uses backend domain; direct uses storage presigned links.


## 4. Management
- **Search/Filter**: By creator (admin) or keywords.
- **Batch Delete**: Choose to delete records or records + storage objects; failures are listed.
- **Update Metadata**: Notes, password, expiration, max views, publicity, proxy toggle.
- **View Passwords**: Admins can see plaintext passwords (for sharing verification).
- **Cache Refresh**: Auto-invalidates on delete/update; manually refresh via "Cache Cleanup" if needed.


## 5. Permissions & Scope
- **Admins**: Full control; can delete records/storage objects, bypass publicity limits.
- **API Keys**: Require `FILE_SHARE`/`FILE_MANAGE` permissions; manage only own files; access restricted by `basic_path`.
- **Public/Private**: Private files show "Not Found/No Permission" to unauthorized users.
 

## 6. Common Use Cases
- **One-Time Downloads**: Set max views=1 or short expiry + signed proxy.
- **Hide Origin**: Enable proxy + time-limited signing; share backend links.
- **Public Library**: Disable proxy/password; restrict to `/public` via `basic_path`.
- **Cleanup**: Use "Batch Delete" or "Expired Cleanup" regularly.
 

## 7. Troubleshooting
- **403/404**: Check publicity, password, or expiry/view limits.
- **Broken Direct Links**: Re-sign or switch to proxy.
- **Missing Files**: Verify API Key’s `basic_path` and permissions.
- **Failed Deletes**: