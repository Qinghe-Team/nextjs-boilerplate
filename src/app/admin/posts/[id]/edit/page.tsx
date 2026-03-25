import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db";
import AdminShell from "@/src/app/_components/admin-shell";
import { updatePostAction } from "@/src/lib/actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const postId = parseInt(id, 10);

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: postId },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  const tagsString = post.tags.map((t) => t.tag.name).join(", ");

  return (
    <AdminShell userName={user.name}>
      <div className="animate-fade-in max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">编辑文章</h1>

        <form action={async (formData: FormData) => {
          "use server";
          await updatePostAction(formData);
        }} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />

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
                defaultValue={post.title}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                defaultValue={post.excerpt}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                defaultValue={post.content}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y font-mono text-sm"
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
                defaultValue={post.coverImage}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                  defaultValue={post.categoryId?.toString() || ""}
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
                  defaultValue={tagsString}
                  placeholder="用逗号分隔，如: Next.js, React"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Published */}
            <div className="flex items-center gap-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={post.published}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
              />
              <label
                htmlFor="published"
                className="text-sm text-card-foreground"
              >
                发布文章
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              保存修改
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
