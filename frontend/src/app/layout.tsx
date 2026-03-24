import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoreGuard SMS - Security Management System',
  description: 'Enterprise security management for regulated private security companies',
  keywords: 'security management, compliance, SMS, guard management, patrol tracking',
  authors: [{ name: 'CoreGuard SMS' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f7b91c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
