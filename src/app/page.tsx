import Link from "next/link";
import { prisma } from "@/src/lib/db";
import PostCard from "./_components/post-card";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { category: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                记录思考
              </span>
              <br />
              <span className="text-foreground">与成长的旅程</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              在这里，我分享编程技术、生活感悟和个人成长的点滴。
              <br />
              用文字记录每一次思考，每一步前行。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
              >
                开始阅读
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">最新文章</h2>
            <Link
              href="/blog"
              className="text-sm text-primary hover:text-primary-dark transition-colors font-medium"
            >
              查看全部 →
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  createdAt={post.createdAt}
                  categoryName={post.category?.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">
                还没有文章。请访问{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/api/seed</code>{" "}
                初始化示例数据，或在
                <Link href="/admin" className="text-primary hover:underline mx-1">
                  管理后台
                </Link>
                创建文章。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            文章分类
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-card-foreground mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat._count.posts} 篇文章
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">暂无分类</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            开始管理你的博客
          </h2>
          <p className="text-muted-foreground mb-6">
            登录管理后台，创建和管理你的文章。
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            进入管理后台
          </Link>
        </div>
      </section>
    </div>
  );
}
