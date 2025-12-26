# Telegram Storage Configuration

CloudPaste supports using **Telegram Channels/Groups** as a storage backend, enabling file upload, download, and management through the Telegram Bot API.

Common use cases:

- Leverage Telegram's free unlimited storage space;
- Need a simple, free file storage solution;
- Already have a Telegram channel/group and want to reuse it.

> The Telegram storage driver **does not provide DirectLink capability**. All file access goes through CloudPaste's proxy.


## Supported Features

The Telegram storage driver supports the following capabilities:

- ✅ **READER**: Read files and directories
- ✅ **WRITER**: Upload, create, rename, delete files
- ✅ **PROXY**: Proxy access
- ✅ **MULTIPART**: Multipart upload (large files)
- ✅ **ATOMIC**: Atomic operations (rename, copy, batch delete)
- ❌ **DIRECT_LINK**: Direct link download not supported

> **Notes**:
> - Delete operations only remove CloudPaste indexes, **Telegram messages/files are not deleted**
> - In official Bot API mode, single file direct upload limit is **20MB**
> - In self-hosted Bot API mode, there are no file size limits


## 1. Prerequisites

### 1.1 Create a Telegram Bot

1. Search for [@BotFather](https://t.me/BotFather) in Telegram and start a conversation
2. Send the `/newbot` command
3. Follow the prompts to enter a Bot name (display name) and username (ending with `_bot`)
4. After creation, BotFather will return a **Bot Token** in this format:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
5. **Save this Token** - you'll need it for configuration

> **Security Tip**: The Bot Token is like a password. Do not share it with others.

### 1.2 Create a Channel or Group

We recommend using a **private channel** as the storage target:

1. Create a new channel in Telegram
2. Set it as a **Private Channel**
3. Add your Bot as a channel administrator:
   - Go to channel settings → Administrators → Add Administrator
   - Search for your Bot username and add it
   - Ensure the Bot has **Post Messages** permission

> **Why use a channel?**
> - Channels have no member count limits
> - Channel messages won't be automatically deleted
> - Private channels protect file privacy

### 1.3 Get the Chat ID

The Chat ID is the unique identifier for your channel/group. Here's how to get it:

**Method 1: Using @RawDataBot**

1. Add [@RawDataBot](https://t.me/RawDataBot) to your channel/group
2. Send any message in the channel
3. RawDataBot will reply with message details - find `"chat": { "id": -100xxxxxxxxxx }`
4. This number (including the negative sign) is the Chat ID
5. You can remove RawDataBot after getting the ID

**Method 2: Using Bot API**

1. Add your Bot to the channel/group
2. Send a message in the channel
3. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Find `chat.id` in the returned JSON

> **Chat ID Format**:
> - Channel IDs usually start with `-100`, e.g., `-1001234567890`
> - Group IDs are usually negative numbers, e.g., `-123456789`
> - Private chat IDs are positive numbers


## 2. Create Telegram Storage Configuration

1. Log in to CloudPaste admin → **Storage Configuration**
2. Click "New Storage Configuration"
3. Select **Telegram** from the "Storage Type" dropdown
4. Fill in the configuration details (see field descriptions below)
5. Click "Test Connection" to verify the configuration
6. After saving, create a mount point for this storage in "Mount Management"

> We recommend testing with small files first to confirm functionality before heavy usage.


## 3. Field Descriptions

### 3.1 Basic Information

- **Configuration Name**
  Any memorable name, e.g., "Telegram File Storage", "TG Backup Channel".

- **Storage Capacity Limit** (optional)
  - Only affects CloudPaste's quota calculation, doesn't actually limit Telegram storage.
  - Telegram itself has no publicly stated storage limits.

### 3.2 Telegram Configuration

> These are the core settings for Telegram storage

- **Bot Token (bot_token)** *Required*
  - The Bot API Token from @BotFather
  - Format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
  - Stored encrypted in the backend

- **Target Chat ID (target_chat_id)** *Required*
  - The channel/group ID where files will be stored
  - **Must be a pure number** (can include negative sign), e.g., `-1001234567890`
  - Username format (like `@channel_name`) is not supported

- **API Base URL (api_base_url)** (optional)
  - Custom Telegram Bot API endpoint
  - Default: `https://api.telegram.org`
  - Used for self-hosted Bot API Server scenarios

### 3.3 Advanced Configuration

- **Bot API Mode (bot_api_mode)**

  | Mode | Description | File Size Limit |
  |------|-------------|-----------------|
  | `official` (default) | Use Telegram's official API | Direct upload ≤ 20MB, each part ≤ 20MB |
  | `self_hosted` | Use self-hosted Bot API Server | No limit |

  > When selecting `self_hosted`, you must also configure `api_base_url` to point to your self-hosted server.

- **Part Size (part_size_mb)** (optional)
  - Size of each part during multipart upload, in MB
  - Range: 5 - 100 MB
  - Default: 15 MB
  - **Note**: In `official` mode, keep this ≤ 20MB to avoid "upload succeeds but download fails" issues

- **Upload Concurrency (upload_concurrency)** (optional)
  - Number of simultaneous upload requests
  - Default: 2
  - Higher concurrency may trigger Telegram API rate limiting (429 errors)

- **Verify After Upload (verify_after_upload)** (optional)
  - Call `getFile` API after upload to verify file size
  - Default: enabled
  - Prevents "upload succeeded but file is corrupted" situations


## 4. How It Works

### 4.1 VFS Architecture

Telegram storage uses a **VFS (Virtual File System) architecture**:

- **Directory tree**: Managed by CloudPaste's `vfs_nodes` table
- **File content**: Stored in Telegram channel/group
- **Index association**: `manifest` records the mapping between files and Telegram messages

```
CloudPaste VFS                    Telegram
┌─────────────────┐              ┌─────────────────┐
│  /documents/    │              │                 │
│    ├── a.pdf    │──────────────│  Message #123   │
│    └── b.docx   │──────────────│  Message #124   │
│  /images/       │              │                 │
│    └── c.jpg    │──────────────│  Message #125   │
└─────────────────┘              └─────────────────┘
```

### 4.2 File Storage Format

Each file is recorded in CloudPaste as a `manifest`:

```json
{
  "kind": "telegram_manifest_v1",
  "storage_type": "TELEGRAM",
  "target_chat_id": "-1001234567890",
  "parts": [
    {
      "partNo": 1,
      "size": 15728640,
      "file_id": "AgACAgIAAxk...",
      "message_id": 123,
      "chat_id": "-1001234567890"
    }
  ]
}
```

### 4.3 Upload Process

**Direct Upload (small files ≤ 20MB)**:
1. CloudPaste calls `sendDocument` API to send the file to the channel
2. Gets the returned `file_id` and `message_id`
3. Creates VFS index node with the manifest

**Multipart Upload (large files)**:
1. Frontend splits the file into multiple parts (default 15MB/part)
2. Each part is sent via backend proxy calling `sendDocument`
3. After all parts are uploaded, manifest is merged
4. VFS index node is created

### 4.4 Download Process

1. Find the index node by VFS path
2. Parse manifest to get `file_id` list
3. Call `getFile` API to get download URLs
4. Concatenate parts in order and return file stream

> **Range Request Support**: Telegram storage supports HTTP Range requests, enabling video seek/scrubbing.


## 5. Self-Hosted Bot API Mode

If you need to upload files larger than 20MB, you can deploy your own Telegram Bot API Server.

### 5.1 Why Self-Host?

| Feature | Official API | Self-Hosted API |
|---------|--------------|-----------------|
| Download file size | ≤ 20MB | No limit |
| Upload file size | ≤ 50MB | ≤ 2000MB |
| Direct upload size | ≤ 20MB | No limit |
| Rate limiting | Limited | Configurable |

### 5.2 Deployment Method

This uses the lightly packaged docker from Cloudpaste [repository address](https://github.com/ling-drag0n/CloudPaste-tgbot)
Contains HuggingFace deployment code.

Quick deployment using Docker:
```bash
docker run -d \
  --name cloudpaste-tg-botapi \
  -p 7860:8081 \
  -e TELEGRAM_API_ID=<your_api_id> \
  -e TELEGRAM_API_HASH=<your_api_hash> \
  dragon730/cloudpaste-tg-botapi:latest
```
By default, it comes with /tg as a suffix, which can be changed via environment variables. After deployment, enable self-hosting in cloudpaste and fill in: "https://corresponding domain address/tg"
> To get `api_id` and `api_hash`: visit [my.telegram.org](https://my.telegram.org) to create an application.
### 5.3 Configure CloudPaste

In storage configuration:
- **API Base URL**: Enter `http://your-server:8081`
- **Bot API Mode**: Select `self_hosted`

### 5.4 Considerations

- Self-hosted server requires stable network connectivity
- HTTPS is recommended for transport security
- Regularly update the telegram-bot-api image


## 6. Mounting and Permissions

After saving the Telegram storage configuration, create a mount point in "Mount Management":

1. Go to **Mount Management** → New Mount
2. Select the Telegram storage configuration
3. Enter mount path (e.g., `/telegram`), notes, etc.
4. Configure options as needed:
   - **Web Proxy**: Telegram must use proxy, usually keep this enabled
   - **Enable Signature**: Whether to enable signature protection for proxy endpoints

The Telegram storage configuration also has an **Allow API Key Usage (is_public)** option:

- When enabled, API keys can use this storage within their mount path scope
- Combined with API key's basic_path and mount path for precise access control

For detailed mounting and permissions, see:

- [Mount Management Guide](/en/guide/mount-management)
- [Storage/Mount Common Settings](/en/guide/storage-common)


## 7. Troubleshooting

### 7.1 Connection Test Failed: Invalid bot_token

**Error message:**
> Telegram test failed: bot_token invalid or inaccessible

**Possible causes:**
- Token entered incorrectly or contains extra spaces
- Bot has been deleted or disabled

**Solutions:**
1. Check Token format (number:alphanumeric)
2. Use `/mybots` in @BotFather to confirm Bot status
3. Create a new Bot if necessary

### 7.2 Connection Test Failed: Cannot Access target_chat_id

**Error message:**
> bot_token is valid, but target_chat_id is inaccessible

**Possible causes:**
- Bot is not in the target channel/group
- Bot doesn't have message sending permission
- Chat ID format is incorrect

**Solutions:**
1. Confirm Bot has been added as channel administrator
2. Confirm Bot has "Post Messages" permission
3. Check Chat ID is in pure number format (e.g., `-1001234567890`)

### 7.3 Upload Failed: File Too Large

**Error message:**
> TELEGRAM single upload too large: without "self-hosted Bot API" (official), direct upload only supports ≤20MB

**Solutions:**
1. **Use multipart upload**: Upload via "Mount Browser" for automatic chunking
2. **Switch to self-hosted mode**: Deploy self-hosted Bot API Server, select `self_hosted` mode
3. **Compress file**: Compress large files before uploading

### 7.4 Upload Succeeds but Download Fails

**Possible causes:**
- Part size exceeds 20MB in `official` mode
- Network issues caused incomplete part uploads

**Solutions:**
1. Check `part_size_mb` setting, ensure ≤ 20MB
2. Enable `verify_after_upload` to verify upload integrity
3. Delete corrupted file and re-upload

### 7.5 Frequent 429 Errors (Rate Limiting)

**Possible causes:**
- Upload concurrency too high
- Too many requests in short time

**Solutions:**
1. Lower `upload_concurrency` (recommend 1-2)
2. Avoid simultaneous large file operations
3. Wait a few minutes before retrying

### 7.6 Deleted Files Still Show in Telegram

**Explanation:**
This is by design. CloudPaste only deletes its own indexes, **Telegram messages are not deleted**.

**Reasons:**
- Deleting messages requires additional Bot permissions
- Keeping messages serves as backup
- Prevents accidental data loss

**To fully delete:**
Manually delete the corresponding messages in the Telegram channel.

### 7.7 Video Seek/Scrubbing Doesn't Work

**Possible causes:**
- File manifest missing part size information
- Browser doesn't support Range requests

**Solutions:**
1. Ensure you're using the latest CloudPaste version
2. Try a different browser
3. Re-upload the video file


## 8. Performance Optimization

### 8.1 Caching

Telegram storage has built-in file info caching:
- Cache TTL: 10 minutes
- Cache capacity: 500 entries (LRU eviction)

Frequently accessed files are automatically cached, reducing API calls.

### 8.2 Concurrency Control

- Default concurrency is 2, suitable for most scenarios
- If network is stable, can increase to 3-4
- If frequent 429 errors, reduce to 1

### 8.3 Part Size Selection

| Scenario | Recommended Part Size |
|----------|----------------------|
| Official API + stable network | 15-20 MB |
| Official API + unstable network | 5-10 MB |
| Self-hosted API | 50-100 MB |


## 9. Comparison with Other Storage Types

| Feature | Telegram | S3 | WebDAV | GitHub API |
|---------|----------|-----|--------|------------|
| Storage cost | Free | Pay per use | Depends on service | Free |
| Direct link support | ❌ | ✅ | ❌ | ✅ |
| Single file size | Unlimited* | Unlimited | Depends on service | 100MB |
| Upload speed | Medium | Fast | Depends on service | Slow |
| Use case | Personal backup | Production | Intranet storage | Config files |

> *Unlimited in self-hosted Bot API mode; official mode requires multipart upload


## 10. Reference Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Bot API Server (Self-Hosted)](https://github.com/tdlib/telegram-bot-api)
- [Get API ID and Hash](https://my.telegram.org)
- [@BotFather](https://t.me/BotFather) - Create and manage Bots
- [@RawDataBot](https://t.me/RawDataBot) - Get Chat ID
