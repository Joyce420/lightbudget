# 轻记账 LightBudget

轻量、离线优先的个人记账与月度预算管理应用。前端使用 React + Vite，云端使用 Supabase。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

未配置 Supabase 时，应用自动使用浏览器本地存储，原有功能不受影响。

## 启用云端后端

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，执行 `supabase/migrations/202609140001_initial_schema.sql`。
3. 在 Authentication > Providers 中启用 Anonymous Sign-Ins。
4. 从 Project Settings > API 复制 Project URL 和 anon/publishable key 到 `.env.local`：

```env
VITE_SUPABASE_URL="https://你的项目.supabase.co"
VITE_SUPABASE_ANON_KEY="你的公开 anon key"
```

5. 重新启动应用。首次连接会把现有本机账本迁移到当前匿名账户。

数据库已启用 Row Level Security，每个登录身份只能访问自己的流水和设置。请勿把 `service_role` 密钥放到前端或提交到 GitHub。

## 检查与构建

```bash
npm run lint
npm run build
```

## 安装到手机

部署后的 HTTPS 地址可作为 PWA 安装：

- iPhone：用 Safari 打开，点“分享” > “添加到主屏幕”。
- Android：用 Chrome 打开，点菜单 > “安装应用”或“添加到主屏幕”。

安装后会以独立窗口运行。已加载过的页面可离线打开；离线时记账先保存在本机，恢复网络后再次打开应用即可继续同步。

## 安卓 APK

仓库的 **Actions** 页面可手动运行 `Build Android APK` 工作流。构建完成后下载 `lightbudget-debug-apk` 产物，解压并安装 `app-debug.apk`。这是调试签名安装包；首次安装时安卓系统会要求允许浏览器或文件管理器安装未知来源应用。
