'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';

import { signoutFunc } from '@/actions/signout';
import { layoutConfig } from '@/config/layout.config';
import { siteConfig } from '@/config/site.config';
import { useAuthStore } from '@/store/auth.store';

import LoginModal from '../modals/login.modal';
import SignupModal from '../modals/signup.modal';

export const Logo = () => (
  <Image src="/logo.png" priority alt={siteConfig.title} width={26} height={26} />
);

const Header = () => {
  const pathname = usePathname();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuth, session, status, setAuthState } = useAuthStore();
  const { headerHeight } = layoutConfig;

  const filteredNavItems = siteConfig.navItems.filter((item) => {
    if (item.href === '/ingredients') {
      return isAuth;
    }
    return true;
  });

  const handleSignout = async () => {
    try {
      await signoutFunc();
    } catch (error) {
      console.error('error sign out:', error);
    }

    setAuthState('unauthenticated', null);
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
      <Navbar
        maxWidth="full"
        style={{ height: headerHeight }}
        className="mx-auto w-full max-w-5xl px-4"
        classNames={{
          wrapper: 'w-full px-0',
          item: 'data-[active=true]:text-gray-900',
        }}
      >
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              {siteConfig.title}
            </span>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden gap-3 md:flex" justify="center">
          {filteredNavItems.map((item) => (
            <NavbarItem key={item.href} isActive={isActive(item.href)}>
              <Link
                href={item.href}
                className={
                  isActive(item.href)
                    ? 'rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white'
                    : 'rounded-full px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="gap-3">
          {status === 'loading' && (
            <span className="text-[11px] text-gray-400">Checking session…</span>
          )}

          {isAuth && status !== 'loading' && (
            <>
              <NavbarItem className="hidden items-center sm:flex">
                <span className="max-w-[220px] truncate text-xs font-medium text-gray-700">
                  Hello, {session?.user?.email ?? 'friend'}!
                </span>
              </NavbarItem>
              <NavbarItem>
                <Button color="default" variant="flat" size="sm" onPress={handleSignout}>
                  Sign out
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </Navbar>
    </header>
  );
};

export default Header;
