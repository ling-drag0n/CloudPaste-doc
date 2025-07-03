import { defineConfig } from "vitepress";

export default defineConfig({
  // 站点级别配置
  title: "CloudPaste",
  description: "基于 Cloudflare 的在线剪贴板和文件分享服务",

  // 多语言配置
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "CloudPaste",
      description: "基于 Cloudflare 的在线剪贴板和文件分享服务，支持 Markdown 编辑和文件上传",
      themeConfig: {
        nav: [
          { text: "首页", link: "/" },
          { text: "快速开始", link: "/guide/quick-start" },
          { text: "API 文档", link: "/api/" },
          { text: "开发指南", link: "/development/" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "指南",
              items: [
                { text: "介绍", link: "/guide/introduction" },
                { text: "快速开始", link: "/guide/quick-start" },
                { text: "功能特点", link: "/guide/features" },
              ],
            },
            {
              text: "部署指南",
              items: [
                { text: "GitHub Actions 部署 (推荐)", link: "/guide/deploy-github-actions" },
                { text: "Docker 部署", link: "/guide/deploy-docker" },
                { text: "更多部署方式", link: "/guide/deploy-manual" },
              ],
            },
            {
              text: "配置指南",
              items: [
                { text: "S3 存储配置", link: "/guide/s3-config" },
                { text: "WebDAV 配置", link: "/guide/webdav" },
              ],
            },
            {
              text: "帮助与支持",
              items: [
                { text: "常见问题", link: "/qa/" },
                { text: "关于", link: "/about/" },
              ],
            },
          ],
          "/api/": [
            {
              text: "API 文档",
              items: [{ text: "API 概述", link: "/api/" }],
            },
          ],
          "/development/": [
            {
              text: "开发指南",
              items: [{ text: "开发环境", link: "/development/" }],
            },
          ],
          "/qa/": [
            {
              text: "使用指南",
              items: [
                { text: "介绍", link: "/guide/introduction" },
                { text: "快速开始", link: "/guide/quick-start" },
                { text: "功能特点", link: "/guide/features" },
              ],
            },
            {
              text: "部署指南",
              items: [
                { text: "GitHub Actions 部署 (推荐)", link: "/guide/deploy-github-actions" },
                { text: "Docker 部署", link: "/guide/deploy-docker" },
                { text: "更多部署方式", link: "/guide/deploy-manual" },
              ],
            },
            {
              text: "配置指南",
              items: [
                { text: "S3 存储配置", link: "/guide/s3-config" },
                { text: "WebDAV 配置", link: "/guide/webdav" },
              ],
            },
            {
              text: "帮助与支持",
              items: [
                { text: "常见问题", link: "/qa/" },
                { text: "关于", link: "/about/" },
              ],
            },
          ],
          "/about/": [
            {
              text: "使用指南",
              items: [
                { text: "介绍", link: "/guide/introduction" },
                { text: "快速开始", link: "/guide/quick-start" },
                { text: "功能特点", link: "/guide/features" },
              ],
            },
            {
              text: "部署指南",
              items: [
                { text: "GitHub Actions 部署 (推荐)", link: "/guide/deploy-github-actions" },
                { text: "Docker 部署", link: "/guide/deploy-docker" },
                { text: "更多部署方式", link: "/guide/deploy-manual" },
              ],
            },
            {
              text: "配置指南",
              items: [
                { text: "S3 存储配置", link: "/guide/s3-config" },
                { text: "WebDAV 配置", link: "/guide/webdav" },
              ],
            },
            {
              text: "帮助与支持",
              items: [
                { text: "常见问题", link: "/qa/" },
                { text: "关于", link: "/about/" },
              ],
            },
          ],
        },
        socialLinks: [{ icon: "github", link: "https://github.com/ling-drag0n/CloudPaste" }],
        footer: {
          message: "基于 Apache License 2.0 许可发布",
          copyright: "Copyright © 2025 CloudPaste",
        },
        editLink: {
          pattern: "https://github.com/ling-drag0n/CloudPaste-doc/blob/master/docs/:path",
          text: "在 GitHub 上编辑此页",
        },
        lastUpdated: {
          text: "最后更新",
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        outline: {
          label: "页面导航",
        },
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      title: "CloudPaste",
      description: "Cloudflare-based online clipboard and file sharing service with Markdown editing and file upload support",
      themeConfig: {
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Guide", link: "/en/guide/introduction" },
          { text: "API", link: "/en/api/" },
          { text: "Development", link: "/en/development/" },
        ],
        sidebar: {
          "/en/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Introduction", link: "/en/guide/introduction" },
                { text: "Quick Start", link: "/en/guide/quick-start" },
                { text: "Features", link: "/en/guide/features" },
              ],
            },
            {
              text: "Deployment Guide",
              items: [
                { text: "GitHub Actions (Recommended)", link: "/en/guide/deploy-github-actions" },
                { text: "Docker Deployment", link: "/en/guide/deploy-docker" },
                { text: "More Deployment Options", link: "/en/guide/deploy-manual" },
              ],
            },
            {
              text: "Configuration Guide",
              items: [
                { text: "S3 Storage Configuration", link: "/en/guide/s3-config" },
                { text: "WebDAV Configuration", link: "/en/guide/webdav" },
              ],
            },
            {
              text: "Help & Support",
              items: [
                { text: "FAQ", link: "/en/qa/" },
                { text: "About", link: "/en/about/" },
              ],
            },
          ],
          "/en/api/": [
            {
              text: "API Documentation",
              items: [{ text: "API Overview", link: "/en/api/" }],
            },
          ],
          "/en/development/": [
            {
              text: "Development Guide",
              items: [{ text: "Development Environment", link: "/en/development/" }],
            },
          ],
          "/en/qa/": [
            {
              text: "User Guide",
              items: [
                { text: "Introduction", link: "/en/guide/introduction" },
                { text: "Quick Start", link: "/en/guide/quick-start" },
                { text: "Features", link: "/en/guide/features" },
              ],
            },
            {
              text: "Deployment Guide",
              items: [
                { text: "GitHub Actions Deployment", link: "/en/guide/deploy-github-actions" },
                { text: "Docker Deployment", link: "/en/guide/deploy-docker" },
                { text: "Manual Deployment", link: "/en/guide/deploy-manual" },
              ],
            },
            {
              text: "Configuration Guide",
              items: [
                { text: "S3 Storage Configuration", link: "/en/guide/s3-config" },
                { text: "WebDAV Configuration", link: "/en/guide/webdav" },
              ],
            },
            {
              text: "Help & Support",
              items: [
                { text: "FAQ", link: "/en/qa/" },
                { text: "About", link: "/en/about/" },
              ],
            },
          ],
          "/en/about/": [
            {
              text: "User Guide",
              items: [
                { text: "Introduction", link: "/en/guide/introduction" },
                { text: "Quick Start", link: "/en/guide/quick-start" },
                { text: "Features", link: "/en/guide/features" },
              ],
            },
            {
              text: "Deployment Guide",
              items: [
                { text: "GitHub Actions Deployment", link: "/en/guide/deploy-github-actions" },
                { text: "Docker Deployment", link: "/en/guide/deploy-docker" },
                { text: "Manual Deployment", link: "/en/guide/deploy-manual" },
              ],
            },
            {
              text: "Configuration Guide",
              items: [
                { text: "S3 Storage Configuration", link: "/en/guide/s3-config" },
                { text: "WebDAV Configuration", link: "/en/guide/webdav" },
              ],
            },
            {
              text: "Help & Support",
              items: [
                { text: "FAQ", link: "/en/qa/" },
                { text: "About", link: "/en/about/" },
              ],
            },
          ],
        },
        socialLinks: [{ icon: "github", link: "https://github.com/ling-drag0n/CloudPaste" }],
        footer: {
          message: "Released under the Apache License 2.0",
          copyright: "Copyright © 2025 CloudPaste",
        },
        editLink: {
          pattern: "https://github.com/ling-drag0n/CloudPaste-doc/blob/master/docs/:path",
          text: "Edit this page on GitHub",
        },
      },
    },
  },

  // 主题配置
  themeConfig: {
    // logo: "/logo.png", // 暂时注释掉，直到添加真实的 logo 文件
    search: {
      provider: "local",
    },
  },

  // 其他配置
  cleanUrls: true,
  lastUpdated: true,

  // 忽略死链接检查（开发环境的 localhost 链接）
  ignoreDeadLinks: [/^http:\/\/localhost/, /^https:\/\/localhost/],

  // 头部配置
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" }],
    ["meta", { name: "theme-color", content: "#646cff" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "CloudPaste | 在线剪贴板和文件分享服务" }],
    ["meta", { property: "og:site_name", content: "CloudPaste" }],
    // ["meta", { property: "og:image", content: "/og-image.png" }], // 暂时注释掉，直到添加真实的 og 图片
    ["meta", { property: "og:url", content: "https://github.com/ling-drag0n/CloudPaste/" }],
  ],
});
