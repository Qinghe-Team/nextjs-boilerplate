import Link from "next/link";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: Date;
  categoryName?: string | null;
}

export default function PostCard({
  title,
  slug,
  excerpt,
  coverImage,
  createdAt,
  categoryName,
}: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Cover Image */}
        {coverImage && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category Badge */}
          {categoryName && (
            <span className="inline-block self-start text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-3">
              {categoryName}
            </span>
          )}

          <h2 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {title}
          </h2>

          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
              {excerpt}
            </p>
          )}

          <time className="text-xs text-muted-foreground mt-auto">
            {formattedDate}
          </time>
        </div>
      </article>
    </Link>
  );
}
