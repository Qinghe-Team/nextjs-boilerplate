import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import AdminShell from "@/src/app/_components/admin-shell";
import { createPostAction } from "@/src/lib/actions";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminShell userName={user.name}>
      <div className="animate-fade-in max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">新建文章</h1>

        <form action={async (formData: FormData) => {
          "use server";
          await createPostAction(formData);
        }} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                标题 <span className="text-danger">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="输入文章标题"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                摘要
              </label>
              <input
                id="excerpt"
                name="excerpt"
                type="text"
                placeholder="简短描述文章内容"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                内容 (Markdown) <span className="text-danger">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={15}
                placeholder="使用 Markdown 编写文章内容..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y font-mono text-sm"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                封面图片 URL
              </label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-card-foreground mb-1.5"
                >
                  分类
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">无分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-card-foreground mb-1.5"
                >
                  标签
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="用逗号分隔，如: Next.js, React"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Published */}
            <div className="flex items-center gap-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
              />
              <label
                htmlFor="published"
                className="text-sm text-card-foreground"
              >
                立即发布
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              创建文章
            </button>
            <a
              href="/admin/posts"
              className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors text-sm"
            >
              取消
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
