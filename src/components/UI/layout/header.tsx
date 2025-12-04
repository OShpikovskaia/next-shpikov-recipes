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

export const Logo = () => {
  return <Image src="/logo.png" priority alt={siteConfig.title} width={26} height={26} />;
};

const Header = () => {
  const path = usePathname();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuth, session, status, setAuthState } = useAuthStore();

  const getNavItems = () => {
    return siteConfig.navItems
      .filter((item) => {
        if (item.href === '/ingredients') {
          return isAuth;
        }
        return true;
      })
      .map((item) => {
        const isActive = path === item.href;

        return (
          <NavbarItem key={item.href} className="px-0">
            <Link
              href={item.href}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[(--color-primary)] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-[(--color-primary-soft)] hover:text-[(--color-primary)]',
              ].join(' ')}
            >
              {item.label}
            </Link>
          </NavbarItem>
        );
      });
  };

  const handleSignout = async () => {
    try {
      await signoutFunc();
    } catch (error) {
      console.error('error sign out:', error);
    }

    setAuthState('unauthenticated', null);
  };

  return (
    <Navbar
      className="border-b border-gray-200 bg-white/80 backdrop-blur-md"
      maxWidth="xl"
      style={{ height: `${layoutConfig.headerHeight}` }}
    >
      <NavbarBrand className="gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <p className="text-sm font-semibold text-slate-900">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {getNavItems()}
      </NavbarContent>

      <NavbarContent justify="end" className="items-center gap-3">
        {status === 'loading' && <span className="text-xs text-gray-500">Checking session…</span>}

        {status !== 'loading' && isAuth && (
          <span className="hidden text-xs text-gray-500 sm:inline">
            Hello,&nbsp;
            <span className="font-medium text-slate-900">{session?.user?.email}</span>!
          </span>
        )}

        {status !== 'loading' && !isAuth && (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button variant="flat" size="sm" onPress={() => setIsLoginOpen(true)}>
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button color="primary" size="sm" onPress={() => setIsSignupOpen(true)}>
                Sign up
              </Button>
            </NavbarItem>
          </>
        )}

        {status !== 'loading' && isAuth && (
          <NavbarItem>
            <Button
              size="sm"
              variant="flat"
              className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
              onPress={handleSignout}
            >
              Sign out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </Navbar>
  );
};

export default Header;
