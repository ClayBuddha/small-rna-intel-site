import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:5173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "小核酸药物全球情报｜核酸前线",
    description: "每日追踪全球小核酸药物管线、临床、融资与 BD 动态，提供可核查来源与中文结构化日报。",
    openGraph: {
      title: "小核酸药物全球情报",
      description: "全球管线、临床、融资与 BD，每日北京时间 18:00 更新。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "小核酸药物全球情报" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "小核酸药物全球情报",
      description: "全球管线、临床、融资与 BD，每日北京时间 18:00 更新。",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
