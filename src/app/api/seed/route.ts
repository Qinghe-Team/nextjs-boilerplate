import { seedAction } from "@/src/lib/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await seedAction();
  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    message: "数据初始化成功！默认管理员: admin@blog.com / admin123",
  });
}
