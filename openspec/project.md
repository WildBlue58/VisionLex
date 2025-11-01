# 图词项目规范

## 项目概述

**图词**（VisionLex，视觉词汇）是一个 AI 驱动的单词学习平台。用户上传图片，AI 分析图片内容并返回一个适合学习的英文单词（A1-A2 级别），同时提供例句、解释和语音朗读功能。Vision 代表视觉识别，Lex 代表词汇学习。

## 技术栈

### 前端框架

- **React** `^19.1.0`
- **React DOM** `^19.1.0`
- **Vite** `^6.3.5` - 构建工具

### 开发工具

- **ESLint** `^9.25.0` - 代码检查
- **TypeScript 类型支持**（通过 `@types/react`）

### AI 服务

- **Moonshot AI (Kimi)** - 图片分析和单词识别
  - 模型：`moonshot-v1-8k-vision-preview`
  - API Key：通过环境变量 `VITE_KIMI_API_KEY` 配置

### 语音服务

- TTS（文字转语音）API
  - Token：`VITE_AUDIO_ACCESS_TOKEN`
  - App ID：`VITE_AUDIO_APP_ID`
  - Cluster ID：`VITE_AUDIO_CLUSTER_ID`
  - Voice Name：`VITE_AUDIO_VOICE_NAME`

## 项目结构

```
visionlex/
├── src/
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 主应用样式
│   ├── main.jsx             # 应用入口
│   ├── index.css            # 全局样式
│   ├── components/          # 组件目录
│   │   └── PictureCard/     # 图片卡片组件
│   │       ├── index.jsx    # 组件逻辑
│   │       └── style.css    # 组件样式
│   └── lib/                 # 工具库
│       └── audio.js         # 音频生成工具
├── public/                  # 静态资源
├── openspec/                # OpenSpec 规范目录
└── package.json             # 依赖配置
```

## 代码规范

### 组件规范

1. **组件划分**：
   - 按功能逻辑划分组件
   - 每个组件独立文件夹（包含 jsx 和 css）
   - 父组件负责状态管理和 API 请求
   - 子组件负责展示和用户交互

2. **组件通信**：
   - 父组件持有状态（state）
   - 父组件通过 props 传递数据给子组件
   - 子组件通过回调函数通知父组件修改状态
   - state 和 props 都是数据，遵循单向数据流

### 文件命名

- 组件文件夹：PascalCase（如 `PictureCard`）
- 组件文件：`index.jsx`
- 样式文件：`style.css` 或 `[ComponentName].css`
- 工具文件：camelCase（如 `audio.js`）

### 代码风格

- 使用函数式组件和 Hooks
- 使用 ES6+ 语法
- 注释使用简体中文
- 保持代码简洁，组件职责单一

## 环境变量

创建 `.env.local` 文件（不提交到版本控制）：

```env
# Moonshot AI (Kimi) API
VITE_KIMI_API_KEY=your_api_key_here

# TTS Audio API
VITE_AUDIO_ACCESS_TOKEN=your_token_here
VITE_AUDIO_APP_ID=your_app_id_here
VITE_AUDIO_CLUSTER_ID=your_cluster_id_here
VITE_AUDIO_VOICE_NAME=your_voice_name_here
```

## 核心功能

### 1. 图片上传与预览

- 支持 `.jpg`, `.jpeg`, `.png`, `.gif` 格式
- 使用 FileReader 转换为 base64
- 实时预览上传的图片

### 2. AI 图片分析

- 调用 Moonshot Vision API
- 返回 JSON 格式数据：
  - `image_discription`: 图片描述
  - `representative_word`: 英文单词（A1-A2 级别）
  - `example_sentence`: 例句
  - `explanation`: 单词解释（多行，以 "Look at..." 开头）
  - `explanation_replys`: 解释回复数组

### 3. 语音播放

- TTS 生成例句音频
- Base64 转 Blob 对象
- 创建临时 URL 播放音频

### 4. 详情展开

- "Talk about it" 按钮展开/折叠详情
- 显示图片预览、逐行解释和回复

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览生产构建
npm run preview
```

## 依赖管理

- 使用 `npm` 或 `pnpm`（项目包含 `pnpm-lock.yaml`）
- 优先使用 npm 官方源
- 定期更新依赖以修复安全漏洞

## 浏览器支持

- 现代浏览器（支持 ES6+）
- 移动端浏览器（主要目标平台）
- FileReader API
- Audio API

## 未来规划

- [ ] 错误处理和用户提示
- [ ] 加载状态优化
- [ ] 单词收藏功能
- [ ] 学习记录统计
- [ ] 离线支持

## 注意事项

1. API Key 和 Token 等敏感信息必须通过环境变量配置
2. `.env.local` 文件不应提交到版本控制
3. 音频 URL 是临时 URL，页面关闭后失效
4. AI 返回的内容需要 JSON 解析，需处理解析错误
