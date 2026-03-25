import { prisma } from "@/src/lib/db";
import PostCard from "@/src/app/_components/post-card";
import Pagination from "@/src/app/_components/pagination";

const POSTS_PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      include: { category: true },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">所有文章</h1>
        <p className="text-muted-foreground">
          共 {totalCount} 篇文章，记录技术与生活的思考。
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h3m-1.5-6h1.5m-4.5 3H9m1.5-3H9m0 0H7.5m4.5 0H15M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
          <p className="text-muted-foreground text-lg">还没有发布的文章</p>
          <p className="text-muted-foreground/70 text-sm mt-1">
            请先初始化数据或在管理后台创建文章
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/blog"
      />
    </div>
  );
}
