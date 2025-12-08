import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

import AppLoader from '@/app/providers/AppLoader';
import Providers from '@/app/providers/Providers';
import { auth } from '@/modules/auth/model/auth';
import { AuthHeader } from '@/modules/auth/widgets/AuthHeader';
import { layoutConfig } from '@/shared/config/layout.config';
import { siteConfig } from '@/shared/config/site.config';
import PageTitle from '@/shared/ui/PageTitle';

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
              <AuthHeader />

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
