import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "qml-shellcraft-course.blumenwagen.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "QML Shellcraft — Zero to Shellwright",
    description: "A playful 26-quest QML and Quickshell adventure. Learn from absolute zero, master reactive UI, and build a living multi-monitor desktop shell.",
    openGraph: {
      title: "QML Shellcraft",
      description: "Zero → Shellwright · 26 interactive quests to build a living desktop shell.",
      type: "website",
      images: [{ url: "/og.png", width: 1728, height: 909, alt: "QML Shellcraft — Zero to Shellwright" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "QML Shellcraft",
      description: "Zero → Shellwright · 26 interactive quests to build a living desktop shell.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
