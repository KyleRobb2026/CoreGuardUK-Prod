import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CoreGuard UK - Security Management System',
  description: 'Professional security management system for CoreGuard UK',
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
      <body style={{ margin: 0, padding: 0 }}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
