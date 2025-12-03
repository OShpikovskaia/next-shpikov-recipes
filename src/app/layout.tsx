import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

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
  const session = await auth();
  const { footerHeight } = layoutConfig;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#fafafa] antialiased`}>
        <Providers session={session}>
          <AppLoader>
            <div className="flex min-h-screen flex-col">
              <Header />

              <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
                <PageTitle />
                {children}
              </main>

              <footer
                className="border-t border-gray-100 bg-white"
                style={{ height: footerHeight }}
              >
                <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6 text-xs text-gray-400">
                  <div className="space-y-1">
                    <p>&copy; {new Date().getFullYear()} Shpikov&apos;s recipes.</p>
                    <p className="max-w-md">{siteConfig.description}</p>
                  </div>
                  <div className="hidden gap-4 sm:flex">
                    <Link
                      href="https://github.com/OShpikovskaia"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-gray-600"
                    >
                      GitHub
                    </Link>
                    <Link href="/about" className="hover:text-gray-600">
                      About project
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </AppLoader>
        </Providers>
      </body>
    </html>
  );
}
