import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              墨韵博客
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              记录思考与成长，分享编程、技术和生活的点滴。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  管理后台
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              关于
            </h4>
            <p className="text-sm text-muted-foreground">
              基于 Next.js 16 构建的现代博客平台。使用 React 19、Tailwind CSS
              和 Prisma 打造。
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 墨韵博客. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
