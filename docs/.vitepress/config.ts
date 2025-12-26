import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

export default withMermaid(
  defineConfig({
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
          sidebar: [
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
                { text: "存储/挂载通用说明", link: "/guide/storage-common" },
                { text: "S3 存储配置", link: "/guide/s3-config" },
                { text: "WebDAV 存储配置", link: "/guide/webdav-storage-config" },
                { text: "OneDrive 存储配置", link: "/guide/onedrive-storage-config" },
                { text: "Google Drive 存储配置", link: "/guide/google-drive-storage-config" },
                { text: "GitHub API 存储配置", link: "/guide/github-api-storage-config" },
                { text: "GitHub Releases 存储配置", link: "/guide/github-releases-storage-config" },
                { text: "Telegram 存储配置", link: "/guide/telegram-storage-config" },
                { text: "本地存储配置", link: "/guide/local-storage-config" },
              ],
            },
            {
              text: "使用指南",
              items: [
                { text: "文本管理", link: "/guide/paste-management" },
                { text: "文件管理", link: "/guide/file-management" },
                { text: "挂载管理", link: "/guide/mount-management" },
                { text: "目录元信息", link: "/guide/fs-meta" },
                { text: "密钥管理", link: "/guide/key-management" },
                { text: "WebDAV 配置", link: "/guide/webdav" },
                { text: "定时任务", link: "/guide/scheduled-tasks" },
                { text: "索引管理", link: "/guide/index-management" },
                { text: "系统设置", link: "/guide/system-settings" },
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
            level: [2, 3],
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
          sidebar: [
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
                { text: "Storage/Mount Common Settings", link: "/en/guide/storage-common" },
                { text: "S3 Storage Configuration", link: "/en/guide/s3-config" },
                { text: "WebDAV Storage Configuration", link: "/en/guide/webdav-storage-config" },
                { text: "OneDrive Storage Configuration", link: "/en/guide/onedrive-storage-config" },
                { text: "Google Drive Storage Configuration", link: "/en/guide/google-drive-storage-config" },
                { text: "GitHub API Storage Configuration", link: "/en/guide/github-api-storage-config" },
                { text: "GitHub Releases Storage Configuration", link: "/en/guide/github-releases-storage-config" },
                { text: "Telegram Storage Configuration", link: "/en/guide/telegram-storage-config" },
                { text: "Local Storage Configuration", link: "/en/guide/local-storage-config" },
              ],
            },
            {
              text: "User Guide",
              items: [
                { text: "Text Management", link: "/en/guide/paste-management" },
                { text: "File Management", link: "/en/guide/file-management" },
                { text: "Mount Management", link: "/en/guide/mount-management" },
                { text: "FS Meta", link: "/en/guide/fs-meta" },
                { text: "API Key Management", link: "/en/guide/key-management" },
                { text: "WebDAV Configuration", link: "/en/guide/webdav" },
                { text: "Scheduled Tasks", link: "/en/guide/scheduled-tasks" },
                { text: "Index Management", link: "/en/guide/index-management" },
                { text: "System Settings", link: "/en/guide/system-settings" },
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
          socialLinks: [{ icon: "github", link: "https://github.com/ling-drag0n/CloudPaste" }],
          footer: {
            message: "Released under the Apache License 2.0",
            copyright: "Copyright © 2025 CloudPaste",
          },
          editLink: {
            pattern: "https://github.com/ling-drag0n/CloudPaste-doc/blob/master/docs/:path",
            text: "Edit this page on GitHub",
          },
          outline: {
            label: "On this page",
            level: [2, 3],
          },
        },
      },
    },

    // 主题配置
    themeConfig: {
      logo: "/logo.png",
      search: {
        provider: "local",
      },
    },

    // Markdown 配置
    markdown: {
      // 图片懒加载
      image: {
        lazyLoading: true,
      },
      // GitHub-flavored Alerts 中文标签
      container: {
        tipLabel: "提示",
        warningLabel: "警告",
        dangerLabel: "危险",
        infoLabel: "信息",
        detailsLabel: "详细信息",
      },
      // 代码组图标插件
      config(md) {
        md.use(groupIconMdPlugin);
      },
    },

    // Vite 配置
    vite: {
      plugins: [
        groupIconVitePlugin(),
      ],
    },

    // 其他配置
    cleanUrls: true,
    lastUpdated: true,

    // SEO 优化
    sitemap: {
      hostname: "https://doc.cloudpaste.qzz.io",
    },

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
      ["meta", { name: "keywords", content: "CloudPaste,剪贴板,文件分享,Cloudflare,Markdown,WebDAV,开源" }],
      ["meta", { name: "author", content: "CloudPaste Team" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:locale", content: "zh-CN" }],
      ["meta", { property: "og:title", content: "CloudPaste | 在线剪贴板和文件分享服务" }],
      ["meta", { property: "og:description", content: "基于 Cloudflare 的现代化文件分享解决方案，支持 Markdown 编辑和多种存储服务" }],
      ["meta", { property: "og:site_name", content: "CloudPaste" }],
      ["meta", { property: "og:image", content: "/logo.png" }],
      ["meta", { property: "og:url", content: "https://doc.cloudpaste.qzz.io/" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: "CloudPaste | 在线剪贴板和文件分享服务" }],
      ["meta", { name: "twitter:description", content: "基于 Cloudflare 的现代化文件分享解决方案，支持 Markdown 编辑和多种存储服务" }],
      ["meta", { name: "twitter:image", content: "/logo.png" }],
    ],
  })
);
