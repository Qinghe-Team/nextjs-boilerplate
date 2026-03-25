import { prisma } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  const htmlContent = await marked(post.content);

  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <svg
          className="mr-1 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回文章列表
      </Link>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-muted">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Meta */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {post.category && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {post.category.name}
            </span>
          )}
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Content */}
      <div
        className="prose text-foreground"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">标签：</span>
            {post.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
