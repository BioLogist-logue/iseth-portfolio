import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "iSETH 포트폴리오 타워",
  description: "교사의 경력이 층층이 쌓이는 인터랙티브 3D 포트폴리오 건물 — 수업 설계, AI·디지털 실천, 앱 개발, 연수, 성장의 기록.",
  openGraph: {
    title: "iSETH 포트폴리오 타워",
    description: "교사의 경력이 층층이 쌓이는 인터랙티브 3D 포트폴리오 건물",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1530" },
  ],
};

// Set the theme before first paint to avoid a light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('iseth-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
