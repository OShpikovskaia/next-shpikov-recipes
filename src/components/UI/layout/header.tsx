'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile-меню

  const { isAuth, session, status, setAuthState } = useAuthStore();

  const navItems = siteConfig.navItems.filter((item) => {
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
    setIsMenuOpen(false);
  };

  const handleOpenLogin = () => {
    setIsMenuOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenSignup = () => {
    setIsMenuOpen(false);
    setIsSignupOpen(true);
  };

  const isActive = (href: string) => path === href;

  return (
    <Navbar
      className="border-b border-gray-200 bg-white/80 backdrop-blur-md"
      maxWidth="xl"
      style={{ height: `${layoutConfig.headerHeight}` }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <p className="text-sm font-semibold text-slate-900">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href} className="px-0">
            <Link
              href={item.href}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-primary-soft hover:text-primary text-slate-700',
              ].join(' ')}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="items-center gap-3">
        {/* Mobile: burger */}
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        />

        {/* Desktop */}
        {status === 'loading' && (
          <span className="hidden text-xs text-gray-500 sm:inline">Checking session…</span>
        )}

        {status !== 'loading' && isAuth && (
          <>
            <span className="hidden text-xs text-gray-500 sm:inline">
              Hello,&nbsp;
              <span className="font-medium text-slate-900">{session?.user?.email}</span>!
            </span>
            <NavbarItem className="hidden sm:flex">
              <Button
                size="sm"
                variant="flat"
                className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
                onPress={handleSignout}
              >
                Sign out
              </Button>
            </NavbarItem>
          </>
        )}

        {status !== 'loading' && !isAuth && (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button variant="flat" size="sm" onPress={handleOpenLogin}>
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Button color="primary" size="sm" onPress={handleOpenSignup}>
                Sign up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              className={[
                'block rounded-full px-4 py-2 text-sm font-medium',
                isActive(item.href)
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary-soft hover:text-primary text-slate-700',
              ].join(' ')}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        <div className="my-2 border-t border-gray-200" />

        {/* Auth-block for mobile view */}
        {status === 'loading' && <p className="px-2 text-xs text-gray-500">Checking session…</p>}

        {status !== 'loading' && isAuth && (
          <div className="flex flex-col gap-2 px-2">
            <span className="text-xs text-gray-500">
              Hello,&nbsp;
              <span className="font-medium text-slate-900">{session?.user?.email}</span>!
            </span>
            <Button
              size="sm"
              variant="flat"
              className="self-start bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
              onPress={handleSignout}
            >
              Sign out
            </Button>
          </div>
        )}

        {status !== 'loading' && !isAuth && (
          <div className="flex flex-col gap-2 px-2">
            <Button size="sm" variant="flat" onPress={handleOpenLogin} className="self-start">
              Login
            </Button>
            <Button size="sm" color="primary" onPress={handleOpenSignup} className="self-start">
              Sign up
            </Button>
          </div>
        )}
      </NavbarMenu>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </Navbar>
  );
};

export default Header;
