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
    description: "A playful 160-quest QML and Quickshell atlas. Learn from absolute zero, build a living multi-monitor shell, and validate it on Linux/Wayland.",
    openGraph: {
      title: "QML Shellcraft",
      description: "Zero → Shellwright · five maps and 160 interactive quests to build a living desktop shell.",
      type: "website",
      images: [{ url: "/og.jpg", width: 1731, height: 909, alt: "QML Shellcraft — Zero to Shellwright" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "QML Shellcraft",
      description: "Zero → Shellwright · five maps and 160 interactive quests to build a living desktop shell.",
      images: ["/og.jpg"],
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
