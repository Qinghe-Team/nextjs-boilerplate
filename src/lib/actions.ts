"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { hashPassword, verifyPassword, createToken, requireAuth } from "./auth";

// ========== Auth Actions ==========

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "请填写邮箱和密码" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "邮箱或密码错误" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "邮箱或密码错误" };
  }

  const token = createToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/admin/login");
}

// ========== Post Actions ==========

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "")
    || `post-${Date.now()}`;
}

export async function createPostAction(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || "";
  const coverImage = (formData.get("coverImage") as string) || "";
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "on";
  const tagsStr = (formData.get("tags") as string) || "";

  if (!title || !content) {
    return { error: "标题和内容不能为空" };
  }

  const slug = generateSlug(title) + "-" + Date.now().toString(36);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      categoryId: categoryId ? parseInt(categoryId) : null,
    },
  });

  // Handle tags
  if (tagsStr.trim()) {
    const tagNames = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    for (const tagName of tagNames) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        create: { name: tagName, slug: tagSlug || `tag-${Date.now()}` },
        update: {},
      });
      await prisma.tagOnPost.create({
        data: { postId: post.id, tagId: tag.id },
      });
    }
  }

  redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData) {
  await requireAuth();

  const id = parseInt(formData.get("id") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || "";
  const coverImage = (formData.get("coverImage") as string) || "";
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "on";
  const tagsStr = (formData.get("tags") as string) || "";

  if (!title || !content) {
    return { error: "标题和内容不能为空" };
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      excerpt,
      coverImage,
      published,
      categoryId: categoryId ? parseInt(categoryId) : null,
    },
  });

  // Update tags
  await prisma.tagOnPost.deleteMany({ where: { postId: id } });
  if (tagsStr.trim()) {
    const tagNames = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    for (const tagName of tagNames) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        create: { name: tagName, slug: tagSlug || `tag-${Date.now()}` },
        update: {},
      });
      await prisma.tagOnPost.create({
        data: { postId: id, tagId: tag.id },
      });
    }
  }

  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireAuth();

  const id = parseInt(formData.get("id") as string);
  await prisma.post.delete({ where: { id } });

  redirect("/admin/posts");
}

export async function togglePublishAction(formData: FormData) {
  await requireAuth();

  const id = parseInt(formData.get("id") as string);
  const post = await prisma.post.findUnique({ where: { id } });
  if (post) {
    await prisma.post.update({
      where: { id },
      data: { published: !post.published },
    });
  }

  redirect("/admin/posts");
}

// ========== Category Actions ==========

export async function createCategoryAction(formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  if (!name) return { error: "分类名不能为空" };

  const slug = name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || `cat-${Date.now()}`;

  await prisma.category.create({ data: { name, slug } });
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAuth();

  const id = parseInt(formData.get("id") as string);
  // Unlink posts from this category first
  await prisma.post.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });
  await prisma.category.delete({ where: { id } });

  redirect("/admin/categories");
}

// ========== Seed Action ==========

export async function seedAction() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return { error: "数据已存在，无需重复初始化" };
  }

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  await prisma.user.create({
    data: {
      email: "admin@blog.com",
      password: hashedPassword,
      name: "管理员",
    },
  });

  // Create categories
  const cat1 = await prisma.category.create({
    data: { name: "技术", slug: "tech" },
  });
  const cat2 = await prisma.category.create({
    data: { name: "生活", slug: "life" },
  });
  const cat3 = await prisma.category.create({
    data: { name: "随笔", slug: "essay" },
  });

  // Create tags
  const tag1 = await prisma.tag.create({
    data: { name: "Next.js", slug: "nextjs" },
  });
  const tag2 = await prisma.tag.create({
    data: { name: "React", slug: "react" },
  });
  const tag3 = await prisma.tag.create({
    data: { name: "TypeScript", slug: "typescript" },
  });

  // Create posts
  const posts = [
    {
      title: "使用 Next.js 16 构建现代 Web 应用",
      slug: "building-modern-web-apps-with-nextjs-16",
      content: `# 使用 Next.js 16 构建现代 Web 应用

Next.js 16 带来了许多激动人心的新特性，让我们一起来探索。

## 异步请求 API

Next.js 16 中，所有请求相关的 API 都变成了异步的：

\`\`\`typescript
// params 现在是 Promise
export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
\`\`\`

## Cache Components

全新的缓存组件模式：

\`\`\`typescript
export default async function Page() {
  'use cache';
  const data = await fetchData();
  return <div>{data}</div>;
}
\`\`\`

## Turbopack 默认启用

Next.js 16 默认使用 Turbopack 进行开发和构建，带来更快的编译速度。

## 总结

Next.js 16 是一个重要的版本更新，它带来了更好的性能和开发体验。赶快升级体验吧！`,
      excerpt: "Next.js 16 带来了异步请求 API、Cache Components 等激动人心的新特性，一起来探索吧。",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      published: true,
      categoryId: cat1.id,
    },
    {
      title: "React 19 新特性详解",
      slug: "react-19-new-features",
      content: `# React 19 新特性详解

React 19 引入了许多新的 Hooks 和功能，让开发变得更加高效。

## Server Components

Server Components 允许我们在服务器端渲染组件，减少客户端 JavaScript 的大小。

## Actions

Actions 让表单处理变得更加简单：

\`\`\`tsx
function AddToCart({ productId }) {
  async function addItem(formData) {
    'use server';
    await db.cart.add(productId);
  }
  return (
    <form action={addItem}>
      <button type="submit">加入购物车</button>
    </form>
  );
}
\`\`\`

## use() Hook

全新的 \`use()\` Hook 可以在组件中读取 Promise 和 Context：

\`\`\`tsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(c => <p key={c.id}>{c.text}</p>);
}
\`\`\`

React 19 让前端开发进入了新时代！`,
      excerpt: "React 19 引入了 Server Components、Actions、use() Hook 等新特性，前端开发进入新时代。",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      published: true,
      categoryId: cat1.id,
    },
    {
      title: "TypeScript 高级类型技巧",
      slug: "typescript-advanced-type-tips",
      content: `# TypeScript 高级类型技巧

掌握 TypeScript 的高级类型系统，可以让你写出更安全、更优雅的代码。

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<42>; // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## 模板字面量类型

\`\`\`typescript
type EventName = \`on\${"Click" | "Hover" | "Focus"}\`;
// "onClick" | "onHover" | "onFocus"
\`\`\`

## infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
\`\`\`

善用这些高级特性，可以让你的 TypeScript 代码更加健壮！`,
      excerpt: "掌握条件类型、映射类型、模板字面量类型等高级技巧，写出更安全优雅的 TypeScript 代码。",
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      published: true,
      categoryId: cat1.id,
    },
    {
      title: "程序员的日常生活",
      slug: "daily-life-of-a-programmer",
      content: `# 程序员的日常生活

作为程序员，每天的生活都充满了挑战和乐趣。

## 早晨

一杯咖啡，打开编辑器，开始新的一天。先检查一下昨晚的构建是否成功，review 几个 PR。

## 上午

进入心流状态，写代码的效率最高。这段时间最适合处理复杂的技术问题。

## 午餐

和同事一起吃饭，聊聊技术、生活，偶尔讨论一下最新的技术趋势。

## 下午

开会、code review、解决 bug。下午的时间容易犯困，需要再来一杯咖啡。

## 晚上

下班后，可能会看看技术博客，学习新技术，或者参与开源项目。

保持学习的热情，享受编程的乐趣！`,
      excerpt: "一杯咖啡，一个编辑器，开始程序员充满挑战和乐趣的一天。",
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      published: true,
      categoryId: cat2.id,
    },
    {
      title: "写作的力量",
      slug: "the-power-of-writing",
      content: `# 写作的力量

写作不仅是一种表达方式，更是一种思考工具。

## 为什么要写作

1. **整理思维** - 写作的过程就是思考的过程
2. **分享知识** - 将你的经验分享给更多的人
3. **记录成长** - 回头看自己写过的文章，能看到自己的成长
4. **建立影响力** - 持续输出高质量内容，建立个人品牌

## 如何开始

不需要等到完美才开始。从今天起，每周写一篇文章，坚持下去，你会看到改变。

> 最好的开始时间是昨天，其次是现在。

开始写作吧，记录你的思考和成长！`,
      excerpt: "写作不仅是表达方式，更是思考工具。开始写作，记录你的思考和成长。",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop",
      published: true,
      categoryId: cat3.id,
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({ data: postData });

    // Add tags
    if (postData.categoryId === cat1.id) {
      await prisma.tagOnPost.createMany({
        data: [
          { postId: post.id, tagId: tag1.id },
          { postId: post.id, tagId: tag2.id },
          { postId: post.id, tagId: tag3.id },
        ],
      });
    }
  }

  return { success: true };
}
