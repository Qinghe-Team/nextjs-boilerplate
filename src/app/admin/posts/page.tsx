import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import Link from "next/link";
import AdminShell from "@/src/app/_components/admin-shell";
import { togglePublishAction, deletePostAction } from "@/src/lib/actions";

export default async function AdminPostsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <AdminShell userName={user.name}>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            新建文章
          </Link>
        </div>

        {/* Posts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {posts.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    标题
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    分类
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    日期
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-card-foreground truncate max-w-xs">
                        {post.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {post.category?.name || "未分类"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("zh-CN").format(
                          new Date(post.createdAt)
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          post.published
                            ? "bg-success/10 text-success"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-xs text-primary hover:text-primary-dark transition-colors font-medium"
                        >
                          编辑
                        </Link>
                        <form action={togglePublishAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                          >
                            {post.published ? "下架" : "发布"}
                          </button>
                        </form>
                        <form action={deletePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="text-xs text-danger hover:text-danger/80 transition-colors font-medium"
                          >
                            删除
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">暂无文章</p>
              <Link
                href="/admin/posts/new"
                className="inline-block mt-3 text-sm text-primary hover:underline"
              >
                创建第一篇文章
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
