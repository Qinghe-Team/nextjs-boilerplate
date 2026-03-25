# 墨韵博客 (Moyin Blog)

一个基于 **Next.js 16** 构建的精美个人博客系统，具有完整的文章管理功能和管理面板。

## ✨ 功能特性

- 📝 **文章管理** - 创建、编辑、删除、发布/下架文章
- 📂 **分类管理** - 文章分类创建和管理
- 🏷️ **标签系统** - 支持文章标签
- 🔐 **管理后台** - JWT 认证的安全管理面板
- 📱 **响应式设计** - 适配桌面端和移动端
- 🎨 **精美 UI** - 使用 Tailwind CSS 构建的现代化界面
- ✍️ **Markdown 支持** - 文章内容支持 Markdown 语法
- 🌙 **暗色模式** - 自动适配系统暗色模式

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: SQLite (本地) / MySQL (生产)
- **ORM**: Prisma
- **认证**: JWT + bcrypt

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

### 3. 初始化数据库

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 初始化示例数据

访问 [http://localhost:3000/api/seed](http://localhost:3000/api/seed) 初始化示例数据。

### 6. 登录管理后台

访问 [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

- **邮箱**: `admin@blog.com`
- **密码**: `admin123`

## 📁 项目结构

```
src/
├── app/
│   ├── _components/       # 共享组件 (Header, Footer, PostCard...)
│   ├── blog/              # 博客前台页面
│   │   ├── page.tsx       # 文章列表
│   │   └── [slug]/        # 文章详情
│   ├── admin/             # 管理后台
│   │   ├── login/         # 登录页
│   │   ├── posts/         # 文章管理
│   │   └── categories/    # 分类管理
│   ├── api/seed/          # 数据初始化 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── lib/
│   ├── db.ts              # 数据库连接
│   ├── auth.ts            # 认证工具
│   └── actions.ts         # Server Actions
└── generated/prisma/      # Prisma 生成的客户端 (自动生成)
prisma/
├── schema.prisma          # 数据库 Schema
└── migrations/            # 数据库迁移文件
```

## 🌐 Vercel 部署

### 使用 MySQL 部署

1. **准备 MySQL 数据库** (推荐 PlanetScale、Aiven 或 Railway)

2. **修改 Prisma Schema**

   编辑 `prisma/schema.prisma`，将 provider 改为 `mysql`:

   ```prisma
   datasource db {
     provider = "mysql"
   }
   ```

3. **设置环境变量**

   在 Vercel 项目设置中添加:

   ```
   DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
   JWT_SECRET=your-production-secret-key
   ```

4. **添加构建命令**

   在 Vercel 项目设置中，设置 Build Command 为:

   ```
   npx prisma generate && npx prisma migrate deploy && next build
   ```

5. **部署**

   ```bash
   npx vercel
   ```

## 📄 License

MIT
