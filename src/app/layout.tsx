import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'タクティカル祓魔師非公式職員証ジェネレータ',
  description: 'タクティカル祓魔師職員証非公式ジェネレータってなんだよ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-D3S7F0JNL9"></GoogleAnalytics>
    </html>
  );
}
