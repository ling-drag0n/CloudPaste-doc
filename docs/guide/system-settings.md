# 系统设置

CloudPaste 提供了丰富的系统设置选项，让您可以根据需要自定义系统的各项功能。

## 全局设置

### 文件上传页限制设置

最大上传文件大小: 此功能仅对上传页面生效，挂载浏览页无限制

新文件默认使用代理: 在上传页面所上传后的文件，文件管理页将显示该文件，如开启该功能则上传的文件分享链接默认是由Worker代理去加载(如果是docker部署那就是对应服务器代理).如关闭，那默认的分析链接就是指向S3存储直链的链接。 

文件覆盖模式: 上传的文件回到对应存储桶中，如开启：存储桶中对应文件要是有相同文件名则会直接覆盖，如关闭：存储桶中对应文件要是有相同文件名不会覆盖，会在末尾以document-a1B2c3.pdf增加额外标识。

### 代理签名设置

此处的全局签名是你在对应挂载管理中的挂载点下开启 web 代理才有用的。打个比方：
你的后端域名是 xxx。你访问对应挂载点下的文件，分几种情况：

对应挂载点中:

```
不开启web代理： 签名没有作用，访问的所有文件都是S3直链形式，流量不走后端。

开启web代理，不开启签名：访问的所有文件都是cf中转，流量走后端（cf）。同时对应的预览地址为： “https://xxx/api/p/挂载点/文件名” 。这个预览地址是永久。

开启web代理，开启签名: 同理，但是地址是 “https://xxx/api/p/挂载点/文件名sign=xxxxxxxxxx&ts=1xxxx” 的形式， 签名过期后预览地址也会销毁 ，若签名时间为0 则是永久地址。

```
如挂载点和全局都设置了签名的时间，那么按照覆盖规则是: 挂载点 > 全局设置。 


## 预览设置

### 文本类型
要作为文本预览的文件扩展名，用 , 分隔，例如 txt,md,go,tsx。

### 音频类型
要作为音频预览的文件扩展名，以 , 分隔，例如 mp3,wav,m4a。

### 视频类型
要作为视频预览的文件扩展名，以 , 分隔，例如 mp4,webm,ogg。

### 图片类型
要作为图像预览的文件扩展名，以 , 分隔，例如 jpg,jpeg,png,gif,webp。

### Office类型

要作为office预览的文件扩展名，以 , 分隔，例如 doc,docx,ppt,pptx,xls,xlsx。
目前是通过在线的微软和谷歌的在线服务进行转换。

### 文档文件

pdf
目前是采用浏览器原生的pdf预览


如遇到文件无法预览可在上述此对应位置加上对应扩展名，只要浏览器支持，那么就可以预览。


## 站点设置

### 站点标题
可自定义站点标题，用于页面标题和浏览器标题。

### 站点图标
可自定义站点图标，用于浏览器标签页和 favicon。

### 页脚内容
可自定义页脚内容，用于显示在页面底部。不填则不显示。

### 公告栏
可自定义公告栏内容，用于在页面首页显示弹出公告。可选关闭。

### 自定义头部
可自定义页面头部内容，用于在页面顶部显示。

比如:
<details>
<summary><b>👉 点击展开：自定义头部示例</b></summary>

```
<!--Polyfill支持-->
<script src="https://polyfill.alicdn.com/v3/polyfill.min.js?features=String.prototype.replaceAll"></script>

<!--引入字体，全局字体使用-->
<link rel="stylesheet" href="https://npm.elemecdn.com/lxgw-wenkai-webfont@1.1.0/lxgwwenkai-regular.css" />

<!--不蒜子计数器-->
<script async src="https://busuanzi.9420.ltd/js"></script>

<!-- Font Awesome图标字体-->
<link type="text/css" rel="stylesheet" href="https://npm.elemecdn.com/font6pro@6.3.0/css/fontawesome.min.css" media="all" />
<link href="https://npm.elemecdn.com/font6pro@6.3.0/css/all.min.css" rel="stylesheet" />

<style>
/* 设置CSS变量 - 这是关键！ */
:root {
  /* 亮色模式背景图 */
  --custom-bg-light: url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  /* 暗色模式背景图 */
  --custom-bg-dark: url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  /* 表面透明效果 */
  --custom-surface-light: rgba(255, 255, 255, 0.5);
  --custom-surface-dark: rgba(0, 0, 0, 0.5);
  /* 文字颜色 */
  --custom-text-light: rgb(17, 24, 39);
  --custom-text-dark: rgb(243, 244, 246);
}

/* 全局字体设置 */
* {
  font-family: 'LXGW WenKai', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: bold !important;
}

/* 背景图片设置 */
.bg-custom-bg-50 {
  background-image: var(--custom-bg-light) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
}

.bg-custom-bg-900 {
  background-image: var(--custom-bg-dark) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
}

/* 透明效果 */
.bg-custom-surface,
.bg-custom-surface-dark,
.card {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
}

/* 按钮透明效果 */
.btn-primary, .btn-secondary {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* 输入框透明效果 */
.form-input {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* 代码块透明效果 */
pre {
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}
</style>
```
</details>

### 自定义body
可自定义页面body内容，在此处设置的任何内容都会自动放置在网页正文的末尾。

<details>
<summary><b>👉 点击展开：自定义body示例</b></summary>

```
<style>
.cloudpaste-custom-footer {
  margin-top: auto;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  text-align: center;
  font-size: 11px;
  opacity: 0.9;
}

.cloudpaste-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.cloudpaste-stats span {
  color: #60a5fa;
  font-weight: bold;
}

.hitokoto-text {
  font-style: italic;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

@media (max-width: 640px) {
  .cloudpaste-stats {
    gap: 10px;
    font-size: 10px;
  }
}
</style>

<div class="cloudpaste-custom-footer">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="hitokoto-text">
      <span id="hitokoto_text">"人生最大的遗憾,就是在最无能为力的时候遇到一个想要保护一生的人."</span>
    </div>
    <div class="cloudpaste-stats" id="busuanzi-container">
      <span>本页访问 <span id="busuanzi_page_pv">-</span> 次</span>
      <span>总访问量 <span id="busuanzi_site_pv">-</span> 次</span>
      <span>访客数 <span id="busuanzi_site_uv">-</span> 人</span>
    </div>
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.6;">
      Powered by CloudPaste © 2025
    </div>
  </div>
</div>

<!-- 一言API -->
<script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto_text" defer></script>

<!-- 不蒜子统计 -->
<script async src="https://busuanzi.9420.ltd/js"></script>
```
</details>

---
