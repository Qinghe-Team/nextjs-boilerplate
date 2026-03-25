import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import AdminShell from "@/src/app/_components/admin-shell";
import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/src/lib/actions";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <AdminShell userName={user.name}>
      <div className="animate-fade-in max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">分类管理</h1>

        {/* Create Category */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-sm font-semibold text-card-foreground mb-4">
            新建分类
          </h2>
          <form action={async (formData: FormData) => {
            "use server";
            await createCategoryAction(formData);
          }} className="flex gap-3">
            <input
              name="name"
              type="text"
              required
              placeholder="输入分类名称"
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
            >
              创建
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat._count.posts} 篇文章 · slug: {cat.slug}
                    </p>
                  </div>
                    <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button
                      type="submit"
                      className="text-xs text-danger hover:text-danger/80 transition-colors font-medium"
                    >
                      删除
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground text-sm">
              暂无分类
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
