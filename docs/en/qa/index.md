# Frequently Asked Questions

This page collects common questions and solutions encountered when using CloudPaste.

## 🚀 Deployment Related

### Q: What to do if GitHub Actions deployment fails?

**A:** Please check the following:

1. **API Token Permissions**: Ensure Cloudflare API Token has the following permissions:

   - Account: Cloudflare Workers:Edit
   - Zone: Zone:Read
   - Account: Cloudflare Pages:Edit
   - Account: D1:Edit

2. **Account ID**: Confirm Cloudflare Account ID is configured correctly

3. **Secrets Configuration**: Check if GitHub Secrets are set correctly:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### Q: Github Action deployment successful, but cannot access?

**A:** Please check:

1. **Whether backend uses custom domain**:

   In mainland China, if you don't have a VPN, the default worker.dev is inaccessible.
   Please access after setting up a custom domain.

2. **Frontend environment variable configuration issue**:

   Check if the configured backend domain is correct, should be in format: "https://your-backend-domain.com", without trailing slash.

3. **Whether to re-run action after configuring frontend environment variables**:

   After configuration, please re-run github action once.

### Q: What to do if .workers.dev domain is inaccessible in China?

**A:** Recommend configuring custom domain:

1. Add custom domain in Cloudflare Workers console
2. Configure DNS resolution
3. Update backend address in frontend environment variables

## 🔧 Configuration Related

### Q: What to do if S3 storage configuration fails?

**A:** Please check:

1. **Access Keys**: Confirm Access Key ID and Secret Access Key are correct
2. **Bucket Permissions**: Ensure bucket allows read/write operations
3. **CORS Configuration**: Check if CORS rules are configured correctly
4. **Network Connection**: Confirm server can access S3 endpoint

### Q: What to do if WebDAV mounting fails?

**A:** Common solutions:

1. **URL Format**: Ensure correct WebDAV URL format is used (backend domain)

   ```
   https://your-domain.com/dav
   ```

2. **Authentication**: Check if username and password are correct
3. **Permission Settings**: Confirm API key has file and mounting permissions
4. **Client Compatibility**: Try different WebDAV clients

### Q: What to do if file upload fails?

**A:** Please check:

1. **File Size**: Confirm file size doesn't exceed limits
2. **Storage Space**: Check if storage space is sufficient
3. **Network Connection**: Confirm network connection is stable
4. **Browser Compatibility**: Try different browsers
5. **S3 Cross-Origin Access**: Check if S3 configuration is correct

## 🔐 Permission Related

### Q: What to do if admin password is forgotten?

**A:** If the username is "admin", depending on the deployment method, you can reset the admin password through the following ways:

#### Method 1: Cloudflare D1 Database Reset (for Cloudflare Workers deployment)

1. **Reset password using Wrangler CLI**:

   ```bash
   # Reset to default password "admin123" (SHA-256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9)
   npx wrangler d1 execute cloudpaste-db --command="UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"

   # Or set custom password (need to calculate SHA-256 hash first)
   # For example, SHA-256 hash of password "newpassword123"
   npx wrangler d1 execute cloudpaste-db --command="UPDATE admins SET password = 'your-sha256-hash-here' WHERE username = 'admin';"
   ```

2. **D1 database direct password modification**:

   Manually modify password in database: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

3. **Local development environment reset**:
   ```bash
   # Local development database reset
   npx wrangler d1 execute cloudpaste-db --local --command="UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"
   ```

#### Method 2: Docker Deployment SQLite Database Reset

1. **Enter Docker container**:

   ```bash
   # View running containers
   docker ps

   # Enter backend container
   docker exec -it <backend-container-name> sh
   ```

2. **Reset using SQLite command line**:

   ```bash
   # Execute inside container
   sqlite3 /app/data/database.db

   # Execute in SQLite command line
   UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';
   .exit
   ```

3. **Or execute SQL command directly**:
   ```bash
   # Execute directly on host machine (if database file is mounted to host)
   docker exec <backend-container-name> sqlite3 /app/data/database.db "UPDATE admins SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE username = 'admin';"
   ```

#### Password Hash Calculation

If you need to set a custom password, you can calculate SHA-256 hash using the following methods:

```bash
# Calculate using Node.js (recommended)
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"

# Calculate using Python
python3 -c "import hashlib; print(hashlib.sha256('your-password'.encode()).hexdigest())"

# Use online tools
# Visit https://emn178.github.io/online-tools/sha256.html
```

#### Important Notes

- Default reset password is `admin123`
- Please login immediately after reset and change to a secure password
- Recommend changing admin password regularly
- Ensure database backup before operation

## 📱 Usage Related

### Q: Can't find any resources after the update

**A:** Clear the cache for the corresponding domain in CF and clear the browser cache, then force a refresh.

### Q: The API key path cannot be selected/only the root directory is available when creating a new key mount path. What should I do?

**A:** Please check if the S3 storage service is correctly configured and **verify whether the corresponding bucket has "Allow API Key" enabled**.

1. Mount points have been configured for the required bucket or subdirectory, and the "Allow API Key" option is enabled.
2. There are actual subfolders or files in the S3 bucket or mounted directory (S3 only displays folders if there are prefix objects or "directory markers").
3. Refresh the page when creating a new API key, and you should see the selectable subdirectories.

### Q: What to do if Markdown editor functions abnormally?

**A:** Try the following solutions:

1. **Clear Cache**: Clear browser cache and cookies
2. **Disable Extensions**: Temporarily disable browser extensions
3. **Switch Browser**: Try using different browsers
4. **Check Network**: Confirm network connection is normal

### Q: What to do if file preview doesn't display?

**A:** Possible causes and solutions:

1. **File Format**: Confirm file format is supported
2. **File Size**: Check if file size is too large
3. **Storage Configuration**: Confirm storage service is configured correctly
4. **CORS Settings**: Check storage service CORS configuration

About video preview:
Supported formats for online video playback:

- mp4 (h264 encoding)
- hls (xx.m3u8)
- flv
  
If video cannot play, or plays without image/sound, this is because all web videos are decoded and played by the browser. This situation occurs when the browser doesn't support decoding for that video type

### Q: What to do if share link is inaccessible?

**A:** Please check:

1. **Link Validity**: Confirm share link hasn't expired
2. **Access Password**: If password is set, confirm password is correct
3. **Access Count**: Check if maximum access count is exceeded
4. **Service Status**: Confirm service is running normally

## 🛠 Troubleshooting

### Q: How to view detailed error information?

**A:** Can be done through:

1. **Browser Console**: Press F12 to view console errors
2. **Server Logs**: Check backend service logs
3. **Docker Logs**: Use `docker-compose logs` to view
4. **Cloudflare Logs**: Check Workers logs in Cloudflare console

### Q: How to update to the latest version?

**A:** Update methods:

1. **GitHub Actions**: Push latest code for automatic deployment
2. **Docker Deployment**:
   ```bash
   docker-compose pull
   docker-compose up -d --force-recreate
   ```
3. **Manual Deployment**: Re-execute deployment steps

## Contributing Q&A

If you encounter new issues and find solutions, welcome to:

1. Submit Pull Request to update this documentation
2. Share experience in GitHub Discussions
3. Help other users solve similar problems

---

