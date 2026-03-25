"use client";

import { useActionState } from "react";
import { loginAction } from "@/src/lib/actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            墨韵博客
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">
            登录管理后台
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl border border-border shadow-lg p-8">
          <form action={formAction} className="space-y-5">
            {/* Error Message */}
            {state?.error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg px-4 py-3">
                {state.error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@blog.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-card-foreground mb-1.5"
              >
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "登录中..." : "登录"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          默认账号: admin@blog.com / admin123
        </p>
      </div>
    </div>
  );
}
