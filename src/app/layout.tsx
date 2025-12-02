import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { auth } from '@/auth/auth';
import Header from '@/components/UI/layout/header';
import PageTitle from '@/components/UI/layout/page-title';
import { layoutConfig } from '@/config/layout.config';
import { siteConfig } from '@/config/site.config';
import AppLoader from '@/hoc/app-loader';
import Providers from '@/providers/providers';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { footerHeight } = layoutConfig;
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>
          <AppLoader>
            <div className="flex min-h-screen flex-col justify-between">
              <div className="flex flex-col">
                <Header />
                <main className={`mx-auto flex max-w-5xl flex-col items-center justify-start px-6`}>
                  <PageTitle />
                  {children}
                </main>
              </div>
              <footer
                className={`flex items-center justify-center`}
                style={{ height: `${footerHeight}` }}
              >
                {siteConfig.description}
              </footer>
            </div>
          </AppLoader>
        </Providers>
      </body>
    </html>
  );
}
