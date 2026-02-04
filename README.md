# 乌鸦的宝藏 (Crow's Treasure) 🪙

> "风将它带来了这里，沉默有时比喧嚣更震耳欲聋。"

**乌鸦的宝藏** 是一个充满神秘主义色彩的情绪记录应用。在这里，您的每一个想法、每一种情绪，都会被神秘的乌鸦铸造成独一无二的数字宝藏（金币、宝石、古剑等），并存入您的私人宝箱中。

## ✨ 特性

- **情绪铸造**: 输入您的想法，选择情绪，AI 将为您生成对应的具象化宝藏。
- **神秘收藏**: 宝藏包括名称、描述、乌鸦的低语评价以及独特的视觉图标。
- **随机回溯**: 通过神秘的仪式（魔法阵交互），随机抽取过去的记忆进行重温。
- **本地存储**: 您的宝藏安全地存储在您的浏览器中。
- **纯净体验**: 极简的视觉设计，带有新艺术运动（Art Nouveau）风格。

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript + Vite
- **样式库**: Tailwind CSS + Framer Motion (动画)
- **AI 驱动**: Google Gemini API (`gemini-3-flash-preview`)
- **图标**: Lucide React

## 🚀 如何运行

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/crows-treasure.git
    cd crows-treasure
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境**
    - 复制 `.env.example` 为 `.env`
    - 在 `.env` 文件中填入您的 Google Gemini API Key:
      ```
      API_KEY=your_api_key_here
      ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

5.  **打包构建**
    ```bash
    npm run build
    ```

## ⚠️ 注意事项

本项目是一个纯前端应用。为了安全起见，**请勿将您的 `.env` 文件或 API Key 上传到公共 GitHub 仓库**。

## 📄 许可证

MIT
