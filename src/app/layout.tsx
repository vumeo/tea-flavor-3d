import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tủa Chùa Shan Teas - Chill Trà",
  description: "Trực quan hóa dữ liệu trà 3D từ Tủa Chùa Shan Teas",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
