import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QML Shellcraft — Learn QML by building a living shell",
  description: "An interactive field course that teaches QML and Quickshell through the construction of a dynamic desktop shell.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
