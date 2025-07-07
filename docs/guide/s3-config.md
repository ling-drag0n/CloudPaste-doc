# S3 存储配置

CloudPaste 支持多种 S3 兼容的对象存储服务，为您的文件提供可靠的存储解决方案。

## 支持的存储服务

### 部分S3存储服务对比

::: tip 价格更新说明
以下价格基于 2024 年 12 月的最新官方信息，实际价格可能因地区、使用量和促销活动而有所不同。建议访问官方网站获取最新价格。
:::

| 服务商            | 免费额度                         | 存储费用                       | 流量费用                         | 1TB 月费用 | 推荐指数   | 适用场景             |
| ----------------- | -------------------------------- | ------------------------------ | -------------------------------- | ---------- | ---------- | -------------------- |
| **Backblaze B2**  | 前 10GB 免费                     | $6/TB/月                       | 3 倍存储量免费<br/>超出 $0.01/GB | $6         | ⭐⭐⭐⭐⭐ | 成本敏感，中等流量   |
| **Wasabi**        | 30 天 1TB 试用                   | $6.99/TB/月                    | 完全免费                         | $6.99      | ⭐⭐⭐⭐   | 大容量存储，低流量   |
| **Hetzner**       | 无                               | $5.99/TB/月                    | 包含 1TB 免费                    | $5.99      | ⭐⭐⭐⭐   | 欧洲用户，性价比优先 |
| **Cloudflare R2** | 10GB 存储/月<br/>100 万次操作/月 | $15/TB/月                      | 完全免费                         | $15        | ⭐⭐⭐⭐⭐ | 高流量应用，全球用户 |
| **DigitalOcean**  | 250GB 存储<br/>1TB 流量          | 基础套餐 $5/月<br/>额外 $20/TB | 包含 1TB                         | $20.48     | ⭐⭐⭐     | 已使用 DO 生态       |
| **Scaleway**      | 75GB 流量/月                     | €12-14.6/TB/月                 | 75GB 免费                        | €21-24     | ⭐⭐⭐     | 欧洲用户，小规模应用 |


### 其他兼容服务

- **阿里云 OSS**
- **腾讯云 COS**
- **七牛云 Kodo**
- **华为云 OBS**
- **Claw Cloud 存储桶**
- **缤纷云存储**
- **TeBi Cloud**
- **MinIO** (自建方案)

## Cloudflare R2 配置

### 1. 开通 R2 服务

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com)
2. 进入 "R2 Object Storage"
3. 点击 "Create bucket"
4. 输入存储桶名称（如 `cloudpaste-files-your-name`，需全局唯一）

### 2. 创建 API 令牌

1. 进入 "Manage R2 API tokens"
2. 点击 "Create API token"
3. 管理 API 令牌
   ![R2api](/images/guide/R2/R2-api.png)
   ![R2rw](/images/guide/R2/R2-rw.png)
4. 记录 Access Key ID 和 Secret Access Key

### 3. 获取端点信息

```
端点格式: https://<account-id>.r2.cloudflarestorage.com
```

在 R2 控制台的存储桶详情页面可以找到完整的端点 URL。

配置跨域规则，点击对应存储桶，点击设置，编辑 CORS 策略，如下所示：

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://根据自己的前端域名来替代"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Backblaze B2 配置

1. 若没有 B2 账号，可以先[注册](https://www.backblaze.com/sign-up/cloud-storage?referrer=getstarted)一个，然后创建一个存储桶。
   ![B2账号注册](/images/guide/B2/B2-1.png)
2. 点击侧边栏的 Application Key，点击 Create Key，然后如图所示。
   ![B2key](/images/guide/B2/B2-2.png)
3. 配置 B2 的跨域，B2 跨域配置比较麻烦，需注意
   ![B2cors](/images/guide/B2/B2-3.png)
4. 可以先尝试一下 1 或 2，去到上传页面看看是否能上传，F12 打开控制台若显示跨域错误，则使用 3。要一劳永逸就直接使用 3（现在建议直接使用3）。

   ![B21](/images/guide/B2/B2-4.png)

关于 3 的配置由于面板无法配置，只能手动配置，需[下载 B2 CLI](https://www.backblaze.com/docs/cloud-storage-command-line-tools)对应工具。具体可以参考："https://docs.cloudreve.org/zh/usage/storage/b2 " 。

下载后，在对应下载目录 cmd，在命令行输入以下命令：
```txt
b2-windows.exe account authorize   //进行账号登录，根据提示填入之前的 keyID 和 applicationKey
b2-windows.exe bucket get <bucketName> //你可以执行获取bucket信息，<bucketName>换成桶名字
```

windows 配置，采用“.\b2-windows.exe xxx”，
所以在对应 cli 的 exe 文件夹中 cmd 输入，python 的 cli 也同理：

```cmd
b2-windows.exe bucket update <bucketName> allPrivate --cors-rules "[{\"corsRuleName\":\"CloudPaste\",\"allowedOrigins\":[\"*\"],\"allowedHeaders\":[\"*\"],\"allowedOperations\":[\"b2_upload_file\",\"b2_download_file_by_name\",\"b2_download_file_by_id\",\"s3_head\",\"s3_get\",\"s3_put\",\"s3_post\",\"s3_delete\"],\"exposeHeaders\":[\"Etag\",\"content-length\",\"content-type\",\"x-bz-content-sha1\"],\"maxAgeSeconds\":3600}]"
```

其中 " <**bucketName**> " 换成你的存储桶名字，关于允许跨域的域名 allowedOrigins 可以根据个人配置，这里是允许所有。

#### 如需要反代B2私有存储桶，可在worker中配置
<details>
<summary><b>👉 点击展开：B2私有桶反代代码</b></summary>
环境变量：

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

## MinIO 自建配置

### 1. 部署 MinIO

1. **部署 MinIO 服务器**

   使用以下 Docker Compose 配置（参考）快速部署 MinIO 服务：

   ```yaml
   version: "3"

   services:
     minio:
       image: minio/minio:RELEASE.2025-02-18T16-25-55Z
       container_name: minio-server
       command: server /data --console-address :9001 --address :9000
       environment:
         - MINIO_ROOT_USER=minioadmin # 设置管理员用户名
         - MINIO_ROOT_PASSWORD=minioadmin # 设置管理员密码
         - MINIO_BROWSER=on
         - MINIO_SERVER_URL=https://minio.example.com # S3 API 访问地址
         - MINIO_BROWSER_REDIRECT_URL=https://console.example.com # 控制台访问地址
       ports:
         - "9000:9000" # S3 API 端口
         - "9001:9001" # 控制台端口
       volumes:
         - ./data:/data
         - ./certs:/root/.minio/certs # 如需配置SSL证书
       restart: always
   ```

   运行 `docker-compose up -d` 启动服务。

2. **配置反向代理（参考）**

   为确保 MinIO 服务正常工作，特别是文件预览功能，需要正确配置反向代理。以下是 OpenResty/Nginx 的推荐配置：

   **MinIO S3 API 反向代理 (minio.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # HTTP 连接优化
       proxy_http_version 1.1;
       proxy_set_header Connection "";  # 启用HTTP/1.1的keepalive

       # 关键配置：解决403错误和预览问题
       proxy_cache off;
       proxy_buffering off;
       proxy_request_buffering off;

       # 无文件大小限制
       client_max_body_size 0;
   }
   ```

   **MinIO 控制台反向代理 (console.example.com)**:

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9001;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # WebSocket 支持
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";

       # 关键配置
       proxy_cache off;
       proxy_buffering off;

       # 无文件大小限制
       client_max_body_size 0;
   }
   ```

3. **访问控制台创建存储桶和创建访问密钥**

   如有详细配置需求，可参考官方文档：https://min.io/docs/minio/container/index.html

   CN: https://min-io.cn/docs/minio/container/index.html

   ![minio-1](/images/guide/minio-1.png)

4. **相关配置（可选）**

   允许的源包含您的前端域名
   ![minio-2](/images/guide/minio-2.png)

5. **在 CloudPaste 中配置 MinIO**

   - 登录 CloudPaste 管理界面
   - 进入 "S3 存储配置" → "添加存储配置"
   - 选择 "其他兼容 S3 服务" 作为提供商类型
   - 填入以下信息：
      - 名称：自定义名称
      - 端点 URL：您的 MinIO 服务地址（如 `https://minio.example.com`）
      - 存储桶名称：之前创建的存储桶名称
      - 访问密钥 ID：您的 Access Key
      - 访问密钥：您的 Secret Key
      - 区域：可留空
      - 路径风格访问：必须启用！！！！
   - 点击 "测试连接" 确认配置正确
   - 保存配置

6. **注意与故障排查**

   - **注意事项**：如使用 Cloudfare 开启 cdn 可能需要加上 proxy_set_header Accept-Encoding "identity"，同时存在缓存问题，最好仅用 DNS 解析
   - **403 错误**：确保反向代理配置中包含 `proxy_cache off` 和 `proxy_buffering off`
   - **预览问题**：确保 MinIO 服务器正确配置了 `MINIO_SERVER_URL` 和 `MINIO_BROWSER_REDIRECT_URL`
   - **上传失败**：检查 CORS 配置是否正确，确保允许的源包含您的前端域名
   - **控制台无法访问**：检查 WebSocket 配置是否正确，特别是 `Connection "upgrade"` 设置


## 更多S3配置待续....

## 在 CloudPaste 中配置

### 1. 登录管理界面

使用管理员账号登录 CloudPaste 管理界面。

### 2. 添加存储配置

1. 进入 "S3 存储配置"
2. 点击 "添加存储配置"
3. 填写配置信息：
   - **配置名称**: 给配置起一个易识别的名称
   - **Access Key ID**: 访问密钥 ID
   - **Secret Access Key**: 访问密钥
   - **存储桶名称**: 存储桶名称
   - **端点 URL**: S3 端点地址
   - **区域**: 存储桶所在区域
   - **路径样式**: 是否强制使用路径样式

### 3. 测试连接

1. 点击 "测试连接" 按钮
2. 确认连接成功
3. 保存配置

### 4. 设置默认存储

1. 在存储配置列表中
2. 选择要设为默认的配置
3. 点击 "设为默认"

## 高级配置

### CORS 配置

为了支持直接上传，需要配置 CORS：

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

### CDN 加速（自定义HOST域名）

#### B2 + CloudFlare CDN实现免流量

代码直达：https://doc.cloudpaste.qzz.io/guide/s3-config#backblaze-b2-%E9%85%8D%E7%BD%AE

参考链接：https://github.com/ling-drag0n/CloudPaste/issues/59

相关解答：https://github.com/ling-drag0n/CloudPaste/issues/67

.....

## 故障排除

### 常见问题

1. **连接失败**

   - 检查端点 URL 是否正确
   - 确认访问密钥有效
   - 验证网络连接

2. **权限错误**

   - 检查 IAM 策略配置
   - 确认存储桶权限设置
   - 验证 CORS 配置，是否配置跨域访问

3. **上传失败**
   - 检查文件大小限制
   - 确认存储空间充足
   - 验证文件格式支持

## 下一步

- [配置 WebDAV](/guide/webdav)
- [查看 API 文档](/api/)
- [了解开发指南](/development/)
- [GitHub Actions 部署](/guide/deploy-github-actions)
