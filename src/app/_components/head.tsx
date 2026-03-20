import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    // 头部容器：白色背景，底部边框，吸顶定位
    <header className="w-full h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* 内容居中容器，最大宽度限制 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        
        {/* 左侧：Logo 区域 */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              NextTest
            </span>
          </Link>
        </div>

        {/* 中间：导航菜单 (桌面端显示) */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/">首页</NavLink>
          <NavLink href="/features">功能</NavLink>
          <NavLink href="/about">关于</NavLink>
          <NavLink href="/blog">博客</NavLink>
        </nav>

        {/* 右侧：用户个人图标 */}
        <div className="flex items-center gap-4">
          {/* 搜索按钮 (可选) */}
          <button className="text-gray-500 hover:text-gray-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* 用户头像/图标 */}
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {/* 这里使用一个简单的 SVG 人物图标 */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            {/* 如果是小屏幕，可以隐藏名字 */}
            <span className="hidden sm:inline">我的账户</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// 简单的导航链接组件，减少代码重复
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}