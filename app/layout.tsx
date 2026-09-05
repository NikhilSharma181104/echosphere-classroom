import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'SonaAI Classroom — AI-Powered Live Learning',
  description:
    'SonaAI Classroom brings AI-powered voice agents into live classrooms. Real-time transcripts, intelligent co-teaching, and seamless collaboration for teachers and students.',
  icons: {
    icon: [
      { url: '/Favicon.png', type: 'image/png' }
    ]
  },
};

import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${manrope.variable} ${inter.variable}`}>
      <body
        className="h-full min-h-screen"
        style={{ fontFamily: 'var(--font-manrope), var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}
      >
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
