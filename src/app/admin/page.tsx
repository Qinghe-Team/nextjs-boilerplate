import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import Link from "next/link";
import AdminShell from "@/src/app/_components/admin-shell";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [totalPosts, publishedPosts, draftPosts, totalCategories, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.category.count(),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { category: true },
      }),
    ]);

  const stats = [
    {
      label: "总文章数",
      value: totalPosts,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "已发布",
      value: publishedPosts,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "草稿",
      value: draftPosts,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "分类数",
      value: totalCategories,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <AdminShell userName={user.name}>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">仪表盘</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-5"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-card-foreground">最近文章</h2>
            <Link
              href="/admin/posts"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="divide-y divide-border">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.category?.name || "未分类"} ·{" "}
                      {new Intl.DateTimeFormat("zh-CN").format(
                        new Date(post.createdAt)
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 ml-4 text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-success/10 text-success"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground text-sm">
              暂无文章，
              <Link
                href="/admin/posts/new"
                className="text-primary hover:underline"
              >
                去创建
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
