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

Configure CORS rules, click the corresponding bucket, click settings, edit CORS policy as shown below:

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

#### If you need to proxy a B2 private bucket, you can configure it in the worker
<details>
<summary><b>👉 Click to expand: B2 private bucket proxy code</b></summary>
Environment variables:

```text
ALLOW_LIST_BUCKET = false
B2_APPLICATION_KEY_ID = 应用 keyID
B2_APPLICATION_KEY = 应用秘钥
B2_ENDPOINT = 端点域名，例如 s3.eu-central-004.backblazeb2.com，不要 https
BUCKET_NAME = 你创建的私密桶名称
```

```js
// node_modules/aws4fetch/dist/aws4fetch.esm.mjs
var encoder = new TextEncoder();
var HOST_SERVICES = {
  appstream2: "appstream",
  cloudhsmv2: "cloudhsm",
  email: "ses",
  marketplace: "aws-marketplace",
  mobile: "AWSMobileHubService",
  pinpoint: "mobiletargeting",
  queue: "sqs",
  "git-codecommit": "codecommit",
  "mturk-requester-sandbox": "mturk-requester",
  "personalize-runtime": "personalize",
};
var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "content-type",
  "content-length",
  "user-agent",
  "presigned-expires",
  "expect",
  "x-amzn-trace-id",
  "range",
  "connection",
]);
var AwsClient = class {
  constructor({ accesskeyID, secretAccessKey, sessionToken, service, region, cache, retries, initRetryMs }) {
    if (accesskeyID == null) throw new TypeError("accesskeyID is a required option");
    if (secretAccessKey == null) throw new TypeError("secretAccessKey is a required option");
    this.accesskeyID = accesskeyID;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    this.service = service;
    this.region = region;
    this.cache = cache || /* @__PURE__ */ new Map();
    this.retries = retries != null ? retries : 10;
    this.initRetryMs = initRetryMs || 50;
  }
  async sign(input, init) {
    if (input instanceof Request) {
      const { method, url, headers, body } = input;
      init = Object.assign({ method, url, headers }, init);
      if (init.body == null && headers.has("Content-Type")) {
        init.body = body != null && headers.has("X-Amz-Content-Sha256") ? body : await input.clone().arrayBuffer();
      }
      input = url;
    }
    const signer = new AwsV4Signer(Object.assign({ url: input }, init, this, init && init.aws));
    const signed = Object.assign({}, init, await signer.sign());
    delete signed.aws;
    try {
      return new Request(signed.url.toString(), signed);
    } catch (e) {
      if (e instanceof TypeError) {
        return new Request(signed.url.toString(), Object.assign({ duplex: "half" }, signed));
      }
      throw e;
    }
  }
  async fetch(input, init) {
    for (let i = 0; i <= this.retries; i++) {
      const fetched = fetch(await this.sign(input, init));
      if (i === this.retries) {
        return fetched;
      }
      const res = await fetched;
      if (res.status < 500 && res.status !== 429) {
        return res;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.random() * this.initRetryMs * Math.pow(2, i)));
    }
    throw new Error("An unknown error occurred, ensure retries is not negative");
  }
};
var AwsV4Signer = class {
  constructor({
    method,
    url,
    headers,
    body,
    accesskeyID,
    secretAccessKey,
    sessionToken,
    service,
    region,
    cache,
    datetime,
    signQuery,
    appendSessionToken,
    allHeaders,
    singleEncode,
  }) {
    if (url == null) throw new TypeError("url is a required option");
    if (accesskeyID == null) throw new TypeError("accesskeyID is a required option");
    if (secretAccessKey == null) throw new TypeError("secretAccessKey is a required option");
    this.method = method || (body ? "POST" : "GET");
    this.url = new URL(url);
    this.headers = new Headers(headers || {});
    this.body = body;
    this.accesskeyID = accesskeyID;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    let guessedService, guessedRegion;
    if (!service || !region) {
      [guessedService, guessedRegion] = guessServiceRegion(this.url, this.headers);
    }
    this.service = service || guessedService || "";
    this.region = region || guessedRegion || "us-east-1";
    this.cache = cache || /* @__PURE__ */ new Map();
    this.datetime = datetime || /* @__PURE__ */ new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
    this.signQuery = signQuery;
    this.appendSessionToken = appendSessionToken || this.service === "iotdevicegateway";
    this.headers.delete("Host");
    if (this.service === "s3" && !this.signQuery && !this.headers.has("X-Amz-Content-Sha256")) {
      this.headers.set("X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD");
    }
    const params = this.signQuery ? this.url.searchParams : this.headers;
    params.set("X-Amz-Date", this.datetime);
    if (this.sessionToken && !this.appendSessionToken) {
      params.set("X-Amz-Security-Token", this.sessionToken);
    }
    this.signableHeaders = ["host", ...this.headers.keys()].filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header)).sort();
    this.signedHeaders = this.signableHeaders.join(";");
    this.canonicalHeaders = this.signableHeaders
      .map((header) => header + ":" + (header === "host" ? this.url.host : (this.headers.get(header) || "").replace(/\s+/g, " ")))
      .join("\n");
    this.credentialString = [this.datetime.slice(0, 8), this.region, this.service, "aws4_request"].join("/");
    if (this.signQuery) {
      if (this.service === "s3" && !params.has("X-Amz-Expires")) {
        params.set("X-Amz-Expires", "86400");
      }
      params.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
      params.set("X-Amz-Credential", this.accesskeyID + "/" + this.credentialString);
      params.set("X-Amz-SignedHeaders", this.signedHeaders);
    }
    if (this.service === "s3") {
      try {
        this.encodedPath = decodeURIComponent(this.url.pathname.replace(/\+/g, " "));
      } catch (e) {
        this.encodedPath = this.url.pathname;
      }
    } else {
      this.encodedPath = this.url.pathname.replace(/\/+/g, "/");
    }
    if (!singleEncode) {
      this.encodedPath = encodeURIComponent(this.encodedPath).replace(/%2F/g, "/");
    }
    this.encodedPath = encodeRfc3986(this.encodedPath);
    const seenKeys = /* @__PURE__ */ new Set();
    this.encodedSearch = [...this.url.searchParams]
      .filter(([k]) => {
        if (!k) return false;
        if (this.service === "s3") {
          if (seenKeys.has(k)) return false;
          seenKeys.add(k);
        }
        return true;
      })
      .map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p))))
      .sort(([k1, v1], [k2, v2]) => (k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0))
      .map((pair) => pair.join("="))
      .join("&");
  }
  async sign() {
    if (this.signQuery) {
      this.url.searchParams.set("X-Amz-Signature", await this.signature());
      if (this.sessionToken && this.appendSessionToken) {
        this.url.searchParams.set("X-Amz-Security-Token", this.sessionToken);
      }
    } else {
      this.headers.set("Authorization", await this.authHeader());
    }
    return {
      method: this.method,
      url: this.url,
      headers: this.headers,
      body: this.body,
    };
  }
  async authHeader() {
    return ["AWS4-HMAC-SHA256 Credential=" + this.accesskeyID + "/" + this.credentialString, "SignedHeaders=" + this.signedHeaders, "Signature=" + (await this.signature())].join(
      ", "
    );
  }
  async signature() {
    const date = this.datetime.slice(0, 8);
    const cacheKey = [this.secretAccessKey, date, this.region, this.service].join();
    let kCredentials = this.cache.get(cacheKey);
    if (!kCredentials) {
      const kDate = await hmac("AWS4" + this.secretAccessKey, date);
      const kRegion = await hmac(kDate, this.region);
      const kService = await hmac(kRegion, this.service);
      kCredentials = await hmac(kService, "aws4_request");
      this.cache.set(cacheKey, kCredentials);
    }
    return buf2hex(await hmac(kCredentials, await this.stringToSign()));
  }
  async stringToSign() {
    return ["AWS4-HMAC-SHA256", this.datetime, this.credentialString, buf2hex(await hash(await this.canonicalString()))].join("\n");
  }
  async canonicalString() {
    return [this.method.toUpperCase(), this.encodedPath, this.encodedSearch, this.canonicalHeaders + "\n", this.signedHeaders, await this.hexBodyHash()].join("\n");
  }
  async hexBodyHash() {
    let hashHeader = this.headers.get("X-Amz-Content-Sha256") || (this.service === "s3" && this.signQuery ? "UNSIGNED-PAYLOAD" : null);
    if (hashHeader == null) {
      if (this.body && typeof this.body !== "string" && !("byteLength" in this.body)) {
        throw new Error("body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header");
      }
      hashHeader = buf2hex(await hash(this.body || ""));
    }
    return hashHeader;
  }
};
async function hmac(key, string) {
  const cryptoKey = await crypto.subtle.importKey("raw", typeof key === "string" ? encoder.encode(key) : key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(string));
}
async function hash(content) {
  return crypto.subtle.digest("SHA-256", typeof content === "string" ? encoder.encode(content) : content);
}
function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("0" + x.toString(16)).slice(-2)).join("");
}
function encodeRfc3986(urlEncodedStr) {
  return urlEncodedStr.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}
function guessServiceRegion(url, headers) {
  const { hostname, pathname } = url;
  if (hostname.endsWith(".r2.cloudflarestorage.com")) {
    return ["s3", "auto"];
  }
  if (hostname.endsWith(".backblazeb2.com")) {
    const match2 = hostname.match(/^(?:[^.]+\.)?s3\.([^.]+)\.backblazeb2\.com$/);
    return match2 != null ? ["s3", match2[1]] : ["", ""];
  }
  const match = hostname.replace("dualstack.", "").match(/([^.]+)\.(?:([^.]*)\.)?amazonaws\.com(?:\.cn)?$/);
  let [service, region] = (match || ["", ""]).slice(1, 3);
  if (region === "us-gov") {
    region = "us-gov-west-1";
  } else if (region === "s3" || region === "s3-accelerate") {
    region = "us-east-1";
    service = "s3";
  } else if (service === "iot") {
    if (hostname.startsWith("iot.")) {
      service = "execute-api";
    } else if (hostname.startsWith("data.jobs.iot.")) {
      service = "iot-jobs-data";
    } else {
      service = pathname === "/mqtt" ? "iotdevicegateway" : "iotdata";
    }
  } else if (service === "autoscaling") {
    const targetPrefix = (headers.get("X-Amz-Target") || "").split(".")[0];
    if (targetPrefix === "AnyScaleFrontendService") {
      service = "application-autoscaling";
    } else if (targetPrefix === "AnyScaleScalingPlannerFrontendService") {
      service = "autoscaling-plans";
    }
  } else if (region == null && service.startsWith("s3-")) {
    region = service.slice(3).replace(/^fips-|^external-1/, "");
    service = "s3";
  } else if (service.endsWith("-fips")) {
    service = service.slice(0, -5);
  } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
    [service, region] = [region, service];
  }
  return [HOST_SERVICES[service] || service, region];
}

// index.js
var UNSIGNABLE_HEADERS2 = [
// These headers appear in the request, but are not passed upstream
"x-forwarded-proto",
"x-real-ip",
// We can't include accept-encoding in the signature because Cloudflare
// sets the incoming accept-encoding header to "gzip, br", then modifies
// the outgoing request to set accept-encoding to "gzip".
// Not cool, Cloudflare!
"accept-encoding",
];
var HTTPS_PROTOCOL = "https:";
var HTTPS_PORT = "443";
var RANGE_RETRY_ATTEMPTS = 3;
function filterHeaders(headers, env) {
return new Headers(
Array.from(headers.entries()).filter(
(pair) => !UNSIGNABLE_HEADERS2.includes(pair[0]) && !pair[0].startsWith("cf-") && !("ALLOWED_HEADERS" in env && !env.ALLOWED_HEADERS.includes(pair[0]))
)
);
}

/**
* 处理响应，检查B2是否正确处理了response参数
* @param {Response} response - 原始响应
* @param {URL} originalUrl - 原始请求URL
* @returns {Response} 处理后的响应
  */
  function processResponse(response, originalUrl) {
  // 如果响应不成功，直接返回
  if (!response.ok) {
  return response;
  }

// 检查B2是否正确处理了response-content-disposition参数
const responseContentDisposition = originalUrl.searchParams.get("response-content-disposition");

if (responseContentDisposition) {
const actualContentDisposition = response.headers.get("Content-Disposition");
if (actualContentDisposition) {
console.log(`B2正确处理了Content-Disposition: ${actualContentDisposition}`);
return response;
} else {
console.log(`B2未设置Content-Disposition，Worker手动设置: ${responseContentDisposition}`);
const responseHeaders = new Headers(response.headers);
responseHeaders.set("Content-Disposition", decodeURIComponent(responseContentDisposition));

      // 检查其他response-*参数
      const responseContentType = originalUrl.searchParams.get("response-content-type");
      if (responseContentType && !response.headers.get("Content-Type")) {
        responseHeaders.set("Content-Type", decodeURIComponent(responseContentType));
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }
}

// 没有response参数，直接返回原始响应
return response;
}
var my_proxy_default = {
async fetch(request, env) {
if (!["GET", "HEAD"].includes(request.method)) {
return new Response(null, {
status: 405,
statusText: "Method Not Allowed",
});
}

    const originalUrl = new URL(request.url);
    const url = new URL(request.url);
    url.protocol = HTTPS_PROTOCOL;
    url.port = HTTPS_PORT;
    let path = url.pathname.replace(/^\//, "");
    path = path.replace(/\/$/, "");
    const pathSegments = path.split("/");

    if (env.ALLOW_LIST_BUCKET !== "true") {
      if ((env.BUCKET_NAME === "$path" && pathSegments.length < 2) || (env.BUCKET_NAME !== "$path" && path.length === 0)) {
        return new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      }
    }
    switch (env.BUCKET_NAME) {
      case "$path":
        url.hostname = env.B2_ENDPOINT;
        break;
      case "$host":
        url.hostname = url.hostname.split(".")[0] + "." + env.B2_ENDPOINT;
        break;
      default:
        url.hostname = env.BUCKET_NAME + "." + env.B2_ENDPOINT;
        break;
    }
    const headers = filterHeaders(request.headers, env);

    // 区分预览和下载请求!!!!!!!!!!!!!!!!!!
    const hasSignature = url.searchParams.has("X-Amz-Signature");

    let forwardRequest;

    if (hasSignature) {
      // 有签名的请求（通常是下载）：直接转发预签名URL
      console.log(`转发预签名URL到B2: ${url.toString()}`);
      forwardRequest = new Request(url.toString(), {
        method: request.method,
        headers: headers,
        body: request.body,
      });
    } else {
      // 无签名的请求（通常是预览）：需要生成预签名URL
      console.log(`无签名请求，生成预签名URL: ${url.pathname}`);

      const endpointRegex = /^s3\.([a-zA-Z0-9-]+)\.backblazeb2\.com$/;
      const [, aws_region] = env.B2_ENDPOINT.match(endpointRegex);
      const client = new AwsClient({
        accesskeyID: env.B2_APPLICATION_KEY_ID,
        secretAccessKey: env.B2_APPLICATION_KEY,
        service: "s3",
        region: aws_region,
      });

      const signedRequest = await client.sign(url.toString(), {
        method: request.method,
        headers,
      });

      forwardRequest = new Request(signedRequest.url, {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: request.body,
      });
    }

    // 处理Range请求的特殊逻辑
    if (forwardRequest.headers.has("range")) {
      let attempts = RANGE_RETRY_ATTEMPTS;
      let response;
      do {
        let controller = new AbortController();
        response = await fetch(forwardRequest.url, {
          method: forwardRequest.method,
          headers: forwardRequest.headers,
          signal: controller.signal,
        });
        if (response.headers.has("content-range")) {
          if (attempts < RANGE_RETRY_ATTEMPTS) {
            console.log(`Retry for ${forwardRequest.url} succeeded - response has content-range header`);
          }
          break;
        } else if (response.ok) {
          attempts -= 1;
          console.error(`Range header in request for ${forwardRequest.url} but no content-range header in response. Will retry ${attempts} more times`);
          if (attempts > 0) {
            controller.abort();
          }
        } else {
          break;
        }
      } while (attempts > 0);
      if (attempts <= 0) {
        console.error(`Tried range request for ${forwardRequest.url} ${RANGE_RETRY_ATTEMPTS} times, but no content-range in response.`);
      }
      return processResponse(response, originalUrl);
    }

    // 普通请求 - 直接转发预签名URL
    const response = await fetch(forwardRequest);
    return processResponse(response, originalUrl);
},
};
export { my_proxy_default as default };

```
</details>

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

#### B2 + CloudFlare CDN for Zero Traffic Costs

Direct code link: https://doc.cloudpaste.qzz.io/guide/s3-config#backblaze-b2-configuration

Reference link: https://github.com/ling-drag0n/CloudPaste/issues/59

Related solution: https://github.com/ling-drag0n/CloudPaste/issues/67
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
