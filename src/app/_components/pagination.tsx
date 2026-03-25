import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  // Build page number array with ellipsis
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  function getHref(page: number) {
    return page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getHref(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          上一页
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground/40 cursor-not-allowed">
          上一页
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 py-2 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={getHref(page)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? "bg-primary text-white font-medium"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getHref(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          下一页
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground/40 cursor-not-allowed">
          下一页
        </span>
      )}
    </nav>
  );
}
