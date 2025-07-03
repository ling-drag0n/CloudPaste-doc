# S3 Storage Configuration

CloudPaste supports multiple S3-compatible storage services, providing reliable storage solutions for your files.

## Supported Storage Services

### Partial S3 Storage Service Comparison

::: tip Price Update Notice
The following prices are based on the latest official information as of December 2024. Actual prices may vary by region, usage, and promotional activities. Please visit official websites for the most current pricing.
:::

| Provider          | Free Tier                                  | Storage Cost                         | Bandwidth Cost                              | 1TB Monthly Cost | Rating     | Use Case                        |
| ----------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------- | ---------------- | ---------- | ------------------------------- |
| **Backblaze B2**  | First 10GB free                            | $6/TB/month                          | 3x storage amount free<br/>Overage $0.01/GB | $6               | ⭐⭐⭐⭐⭐ | Cost-sensitive, medium traffic  |
| **Wasabi**        | 30-day 1TB trial                           | $6.99/TB/month                       | Completely free                             | $6.99            | ⭐⭐⭐⭐   | Large storage, low traffic      |
| **Hetzner**       | None                                       | $5.99/TB/month                       | 1TB included                                | $5.99            | ⭐⭐⭐⭐   | European users, cost-effective  |
| **Cloudflare R2** | 10GB storage/month<br/>1M operations/month | $15/TB/month                         | Completely free                             | $15              | ⭐⭐⭐⭐⭐ | High traffic apps, global users |
| **DigitalOcean**  | 250GB storage<br/>1TB bandwidth            | Basic plan $5/month<br/>Extra $20/TB | 1TB included                                | $20.48           | ⭐⭐⭐     | Existing DO ecosystem           |
| **Scaleway**      | 75GB bandwidth/month                       | €12-14.6/TB/month                    | 75GB free                                   | €21-24           | ⭐⭐⭐     | European users, small scale     |

### Other Compatible Services

- **Alibaba Cloud OSS**
- **Tencent Cloud COS**
- **Qiniu Cloud Kodo**
- **Huawei Cloud OBS**
- **Claw Cloud Storage**
- **Binfen Cloud Storage**
- **TeBi Cloud**
- **MinIO** (Self-hosted solution)

## Cloudflare R2 Configuration

### 1. Enable R2 Service

1. Login to [Cloudflare Console](https://dash.cloudflare.com)
2. Go to "R2 Object Storage"
3. Click "Create bucket"
4. Enter bucket name (e.g., `cloudpaste-files-your-name`, must be globally unique)

### 2. Create API Token

1. Go to "Manage R2 API tokens"
2. Click "Create API token"
3. Manage API tokens
   ![R2api](/images/guide/R2/R2-api.png)
   ![R2rw](/images/guide/R2/R2-rw.png)
4. Record Access Key ID and Secret Access Key

### 3. Get Endpoint Information

```
Endpoint format: https://<account-id>.r2.cloudflarestorage.com
```

You can find the complete endpoint URL in the bucket details page of the R2 console.

5. Configure CORS rules, click the corresponding bucket, click settings, edit CORS policy as shown below:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://replace-with-your-frontend-domain"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Backblaze B2 Configuration

1. If you don't have a B2 account, you can [register](https://www.backblaze.com/sign-up/cloud-storage?referrer=getstarted) one first, then create a bucket.
   ![B2 Account Registration](/images/guide/B2/B2-1.png)
2. Click Application Key in the sidebar, click Create Key, then as shown in the figure.
   ![B2key](/images/guide/B2/B2-2.png)
3. Configure B2 CORS, B2 CORS configuration is more complicated, please note
   ![B2cors](/images/guide/B2/B2-3.png)
4. You can try 1 or 2 first, go to the upload page to see if you can upload, open F12 console if it shows CORS error, then use 3. For a one-time solution, use 3 directly (now recommend using 3 directly).

   ![B21](/images/guide/B2/B2-4.png)

Regarding configuration 3, since the panel cannot configure it, it can only be configured manually. You need to [download B2 CLI](https://www.backblaze.com/docs/cloud-storage-command-line-tools) corresponding tool. You can refer to: "https://docs.cloudreve.org/zh/usage/storage/b2".

After downloading, cmd in the corresponding download directory, enter the following commands in the command line:

```txt
b2-windows.exe account authorize   //Account login, fill in the previous keyID and applicationKey according to the prompts
b2-windows.exe bucket get <bucketName> //You can execute to get bucket information, replace <bucketName> with bucket name
```

Windows configuration, use ".\b2-windows.exe xxx",
So cmd input in the corresponding cli exe folder, python cli is the same:

```cmd
b2-windows.exe bucket update <bucketName> allPrivate --cors-rules "[{\"corsRuleName\":\"CloudPaste\",\"allowedOrigins\":[\"*\"],\"allowedHeaders\":[\"*\"],\"allowedOperations\":[\"b2_upload_file\",\"b2_download_file_by_name\",\"b2_download_file_by_id\",\"s3_head\",\"s3_get\",\"s3_put\",\"s3_post\",\"s3_delete\"],\"exposeHeaders\":[\"Etag\",\"content-length\",\"content-type\",\"x-bz-content-sha1\"],\"maxAgeSeconds\":3600}]"
```

Where " <**bucketName**> " should be replaced with your bucket name. Regarding allowedOrigins for cross-domain allowed domains, you can configure according to personal needs, here it allows all.

## MinIO Self-hosted Configuration

### 1. Deploy MinIO

1. **Deploy MinIO Server**

   Use the following Docker Compose configuration (reference) to quickly deploy MinIO service:

   ```yaml
   version: "3"

   services:
     minio:
       image: minio/minio:RELEASE.2025-02-18T16-25-55Z
       container_name: minio-server
       command: server /data --console-address :9001 --address :9000
       environment:
         - MINIO_ROOT_USER=minioadmin # Set admin username
         - MINIO_ROOT_PASSWORD=minioadmin # Set admin password
         - MINIO_BROWSER=on
         - MINIO_SERVER_URL=https://minio.example.com # S3 API access address
         - MINIO_BROWSER_REDIRECT_URL=https://console.example.com # Console access address
       ports:
         - "9000:9000" # S3 API port
         - "9001:9001" # Console port
       volumes:
         - ./data:/data
         - ./certs:/root/.minio/certs # If SSL certificate configuration is needed
       restart: always
   ```

   Run `docker-compose up -d` to start the service.

2. **Configure Reverse Proxy (Reference)**

   To ensure MinIO service works properly, especially file preview functionality, reverse proxy needs to be configured correctly. Here's the recommended OpenResty/Nginx configuration:

   **MinIO S3 API Reverse Proxy (minio.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # HTTP connection optimization
       proxy_http_version 1.1;
       proxy_set_header Connection "";  # Enable HTTP/1.1 keepalive

       # Key configuration: solve 403 errors and preview issues
       proxy_cache off;
       proxy_buffering off;
       proxy_request_buffering off;

       # No file size limit
       client_max_body_size 0;
   }
   ```

   **MinIO Console Reverse Proxy (console.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9001;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # WebSocket support
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";

       # Key configuration
       proxy_cache off;
       proxy_buffering off;

       # No file size limit
       client_max_body_size 0;
   }
   ```

3. **Access Console to Create Bucket and Access Key**

   For detailed configuration requirements, refer to official documentation: https://min.io/docs/minio/container/index.html

   CN: https://min-io.cn/docs/minio/container/index.html

   ![minio-1](/images/guide/minio-1.png)

4. **Related Configuration (Optional)**

   Allowed origins include your frontend domain
   ![minio-2](/images/guide/minio-2.png)

5. **Configure MinIO in CloudPaste**

   - Login to CloudPaste admin interface
   - Go to "S3 Storage Configuration" → "Add Storage Configuration"
   - Select "Other S3-compatible service" as provider type
   - Fill in the following information:
     - Name: Custom name
     - Endpoint URL: Your MinIO service address (e.g., `https://minio.example.com`)
     - Bucket name: Previously created bucket name
     - Access Key ID: Your Access Key
     - Access Key: Your Secret Key
     - Region: Can be left empty
     - Path style access: Must be enabled!!!!
   - Click "Test connection" to confirm configuration is correct
   - Save configuration

6. **Notes and Troubleshooting**

   - **Note**: If using Cloudflare with CDN enabled, you may need to add `proxy_set_header Accept-Encoding "identity"`, and there may be caching issues, it's best to use DNS resolution only
   - **403 error**: Ensure reverse proxy configuration includes `proxy_cache off` and `proxy_buffering off`
   - **Preview issues**: Ensure MinIO server is correctly configured with `MINIO_SERVER_URL` and `MINIO_BROWSER_REDIRECT_URL`
   - **Upload failures**: Check CORS configuration is correct, ensure allowed origins include your frontend domain
   - **Console inaccessible**: Check WebSocket configuration is correct, especially `Connection "upgrade"` setting

## More S3 Configuration Coming...

## Configure in CloudPaste

### 1. Login to Admin Interface

Login to CloudPaste admin interface using administrator account.

### 2. Add Storage Configuration

1. Go to "S3 Storage Configuration"
2. Click "Add Storage Configuration"
3. Fill in configuration information:
   - **Configuration Name**: Give the configuration an easily recognizable name
   - **Access Key ID**: Access key ID
   - **Secret Access Key**: Access key
   - **Bucket Name**: Bucket name
   - **Endpoint URL**: S3 endpoint address
   - **Region**: Bucket region
   - **Path Style**: Whether to force path style

### 3. Test Connection

1. Click "Test Connection" button
2. Confirm connection is successful
3. Save configuration

### 4. Set Default Storage

1. In storage configuration list
2. Select configuration to set as default
3. Click "Set as Default"

## Advanced Configuration

### CORS Configuration

To support direct upload, CORS needs to be configured:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### CDN Acceleration (Custom HOST Domain)

#### B2 + CloudFlare CDN for Free Traffic

Reference link: https://github.com/ling-drag0n/CloudPaste/issues/59

Related answer: https://github.com/ling-drag0n/CloudPaste/issues/67

.....

## Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check if endpoint URL is correct
   - Confirm access keys are valid
   - Verify network connection

2. **Permission Error**

   - Check IAM policy configuration
   - Confirm bucket permission settings
   - Verify CORS configuration, check if cross-origin access is configured

3. **Upload Failed**
   - Check file size limits
   - Confirm sufficient storage space
   - Verify file format support

## Next Steps

- [Configure WebDAV](/en/guide/webdav)
- [View API Documentation](/en/api/)
- [Learn Development Guide](/en/development/)
- [GitHub Actions Deployment](/en/guide/deploy-github-actions)
