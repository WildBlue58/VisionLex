# 图词（VisionLex）Vercel 部署指南

## ✅ 构建测试结果

构建已成功完成！

```
✓ 构建时间: 1.08s
✓ 输出目录: dist/
✓ 文件清单:
  - index.html (0.76 kB, gzip: 0.48 kB)
  - assets/index-Bns_POs_.css (36.05 kB, gzip: 6.56 kB)
  - assets/react-vendor-1zw1pNgy.js (11.72 kB, gzip: 4.17 kB)
  - assets/index-vhzTHMn5.js (199.40 kB, gzip: 64.31 kB)
```

## 📦 部署到 Vercel

### 方法一：通过 Vercel Dashboard（推荐）

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的仓库（或先连接 Git 提供商）
   - Vercel 会自动检测到 Vite 项目

3. **配置环境变量**
   - 在项目设置中添加以下环境变量：
     ```
     VITE_KIMI_API_KEY=你的Moonshot API密钥
     VITE_AUDIO_ACCESS_TOKEN=你的TTS访问令牌（可选）
     VITE_AUDIO_APP_ID=你的TTS应用ID（可选）
     VITE_AUDIO_CLUSTER_ID=你的TTS集群ID（可选）
     VITE_AUDIO_VOICE_NAME=你的TTS语音名称（可选）
     ```

4. **部署配置**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`（自动检测）
   - Output Directory: `dist`（自动检测）
   - Install Command: `npm install`（自动检测）

5. **点击 Deploy**
   - 等待构建完成（通常 1-2 分钟）
   - 部署成功后获得生产 URL

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```
   
   - 第一次部署会询问配置
   - 后续部署使用 `vercel --prod` 直接部署到生产环境

4. **设置环境变量**
   ```bash
   vercel env add VITE_KIMI_API_KEY
   vercel env add VITE_AUDIO_ACCESS_TOKEN
   # ... 其他环境变量
   ```

## ⚙️ 环境变量配置

### 必需环境变量

| 变量名 | 说明 | 获取地址 |
|--------|------|----------|
| `VITE_KIMI_API_KEY` | Moonshot AI API 密钥 | [Moonshot Console](https://platform.moonshot.cn/console/api-keys) |

### 可选环境变量（TTS功能）

| 变量名 | 说明 |
|--------|------|
| `VITE_AUDIO_ACCESS_TOKEN` | TTS 访问令牌 |
| `VITE_AUDIO_APP_ID` | TTS 应用ID |
| `VITE_AUDIO_CLUSTER_ID` | TTS 集群ID |
| `VITE_AUDIO_VOICE_NAME` | TTS 语音名称 |

⚠️ **重要提示：**
- 环境变量名必须以 `VITE_` 开头才能在客户端使用
- 修改环境变量后需要重新部署才能生效
- 不要在代码中硬编码密钥

## 🔧 部署配置说明

项目已包含 `vercel.json` 配置文件：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这个配置确保了：
- ✅ SPA 路由正常工作（所有路由指向 index.html）
- ✅ 静态资源缓存优化
- ✅ 自动检测 Vite 框架

## 🚀 部署后验证

部署成功后，检查以下内容：

1. **访问主页**
   - 确认页面正常加载
   - 检查控制台无错误

2. **测试图片上传**
   - 上传一张图片
   - 检查 AI 分析是否正常工作

3. **检查功能**
   - ✅ 图片上传与预览
   - ✅ AI 单词识别
   - ✅ 语音播放（如已配置）
   - ✅ 历史记录保存
   - ✅ 响应式布局

## 📊 性能优化建议

Vercel 会自动进行以下优化：
- ✅ 全球 CDN 分发
- ✅ 自动 HTTPS
- ✅ 压缩与缓存
- ✅ 边缘网络加速

### 进一步优化（可选）

1. **启用 Analytics**
   - 在 Vercel Dashboard 中启用 Analytics
   - 监控性能指标

2. **配置自定义域名**
   - 在项目设置中添加域名
   - 配置 DNS 记录

3. **设置环境变量**
   - 分别为 Production、Preview、Development 设置不同环境变量

## 🐛 常见问题

### 1. 构建失败
- 检查 Node.js 版本（建议 18+）
- 确保所有依赖正确安装
- 查看构建日志中的错误信息

### 2. 环境变量未生效
- 确认变量名以 `VITE_` 开头
- 重新部署项目
- 在 Vercel Dashboard 中检查变量是否已添加

### 3. API 请求失败
- 检查 API 密钥是否正确
- 确认 Moonshot API 有足够余额
- 检查网络请求（F12 Network 标签）

### 4. 路由404错误
- 确认 `vercel.json` 中的 rewrites 配置正确
- 检查是否为 SPA 模式

## 📝 部署清单

部署前确认：
- [ ] 本地构建成功 (`npm run build`)
- [ ] 所有环境变量已准备
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] `vercel.json` 配置正确
- [ ] README 文档已更新

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Moonshot AI 控制台](https://platform.moonshot.cn/console)

---

**部署状态：** ✅ 构建测试通过，可以部署到 Vercel

