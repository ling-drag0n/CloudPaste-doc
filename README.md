# CloudPaste 文档网站

这是 CloudPaste 项目的官方文档网站，基于 VitePress 构建，支持中英文双语。

> **CloudPaste** 是基于 Cloudflare 的在线剪贴板和文件分享服务，支持 Markdown 编辑和文件上传。

<div align="center">
    <img width="100" height="100" src="https://img.icons8.com/dusk/100/paste.png" alt="paste"/>
</div>

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run docs:dev
```

访问 http://localhost:5173 查看文档网站。

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产版本

```bash
npm run docs:preview
```

## 📁 项目结构

```
cloudpaste-docs/
├── docs/                    # 文档源文件
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.ts       # 主配置文件
│   │   └── theme/          # 自定义主题
│   ├── public/             # 静态资源
│   ├── index.md            # 中文首页
│   ├── en/                 # 英文文档
│   ├── guide/              # 指南
│   ├── deploy/             # 部署指南
│   ├── api/                # API 文档
│   └── development/        # 开发指南
├── package.json
└── README.md
```

## 🌐 多语言支持

文档网站支持中英文双语：

- **中文**: `/` (默认)
- **English**: `/en/`

## 📝 编写文档

### Markdown 扩展

VitePress 支持丰富的 Markdown 扩展：

- **代码块**: 支持语法高亮和行号
- **自定义容器**: tip、warning、danger 等
- **表格**: 支持表格渲染
- **数学公式**: 支持 LaTeX 数学公式
- **图表**: 支持 Mermaid 图表

### 示例

```markdown
# 标题

## 代码块
\`\`\`javascript
console.log('Hello World')
\`\`\`

## 自定义容器
::: tip 提示
这是一个提示容器
:::

## 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
```

## 🎨 主题定制

### 自定义样式

编辑 `docs/.vitepress/theme/custom.css` 文件来自定义样式：

```css
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
  --vp-c-brand-3: #535bf2;
}
```

## 🔧 配置说明

### 站点配置

在 `docs/.vitepress/config.ts` 中配置站点信息：

```typescript
export default defineConfig({
  title: 'CloudPaste',
  description: '基于 Cloudflare 的在线剪贴板和文件分享服务',
  
  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en-US'
    }
  }
})
```

## 📦 部署

### GitHub Pages

1. 在 GitHub 仓库中启用 Pages
2. 配置 GitHub Actions 自动部署
3. 推送代码即可自动部署

### Vercel

1. 连接 GitHub 仓库到 Vercel
2. 配置构建命令: `npm run docs:build`
3. 配置输出目录: `docs/.vitepress/dist`

### Netlify

1. 连接 GitHub 仓库到 Netlify
2. 配置构建命令: `npm run docs:build`
3. 配置发布目录: `docs/.vitepress/dist`

## 🤝 贡献指南

### 贡献文档

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/new-docs`
3. 编写或修改文档
4. 提交更改: `git commit -m 'docs: add new documentation'`
5. 推送分支: `git push origin feature/new-docs`
6. 创建 Pull Request

### 文档规范

- 使用清晰的标题结构
- 提供代码示例
- 添加适当的链接
- 保持中英文同步更新
- 使用一致的术语

## 📄 许可证

本文档基于 [Apache License 2.0](LICENSE) 许可证发布。

## 🔗 相关链接

- [CloudPaste 主项目](https://github.com/ling-drag0n/CloudPaste)
- [VitePress 官方文档](https://vitepress.dev/)
- [Vue.js 官方文档](https://vuejs.org/)

## 💬 获取帮助

如果您在使用文档网站时遇到问题：

1. 查看 [VitePress 官方文档](https://vitepress.dev/)
2. 搜索 [GitHub Issues](https://github.com/ling-drag0n/CloudPaste/issues)
3. 提交新的 [Issue](https://github.com/ling-drag0n/CloudPaste/issues/new)
4. 参与 [GitHub Discussions](https://github.com/ling-drag0n/CloudPaste/discussions)
