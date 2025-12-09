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
import clsx from 'clsx';

import { layoutConfig } from '@/shared/config/layout.config';
import { siteConfig } from '@/shared/config/site.config';

import { AUTH_STATUS, type SessionStatus } from '../model/auth-status';

type NavItem = {
  href: string;
  label: string;
};

type NavVariant = 'desktop' | 'mobile';

const getNavItemClass = (active: boolean, variant: NavVariant) =>
  clsx(
    'rounded-full text-sm font-medium',
    variant === 'desktop' && 'px-4 py-1.5 transition-colors',
    variant === 'mobile' && 'block px-4 py-2',
    active
      ? 'bg-primary text-white shadow-sm'
      : 'text-slate-700 hover:bg-primary-soft hover:text-primary',
  );

interface HeaderProps {
  navItems: NavItem[];
  isAuth: boolean;
  status: SessionStatus;
  userEmail?: string | null;
  onSignout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

const Logo = () => {
  return <Image src="/logo.png" priority alt={siteConfig.title} width={26} height={26} />;
};

const Header = ({
  navItems,
  isAuth,
  status,
  userEmail,
  onSignout,
  onOpenLogin,
  onOpenSignup,
}: HeaderProps) => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      {/* desktop nav */}
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href} className="px-0">
            <Link href={item.href} className={getNavItemClass(isActive(item.href), 'desktop')}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* right block */}
      <NavbarContent justify="end" className="items-center gap-3">
        {/* mobile burger */}
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        />

        {/* desktop auth */}
        {status === AUTH_STATUS.LOADING && (
          <span className="hidden text-xs text-gray-500 sm:inline">Checking session…</span>
        )}

        {status !== AUTH_STATUS.LOADING && isAuth && (
          <>
            <span className="hidden text-xs text-gray-500 sm:inline">
              Hello,&nbsp;
              <span className="font-medium text-slate-900">{userEmail}</span>!
            </span>
            <NavbarItem className="hidden sm:flex">
              <Button
                size="sm"
                variant="flat"
                className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
                onPress={onSignout}
              >
                Sign out
              </Button>
            </NavbarItem>
          </>
        )}

        {status !== AUTH_STATUS.LOADING && !isAuth && (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button variant="flat" size="sm" onPress={onOpenLogin}>
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Button color="primary" size="sm" onPress={onOpenSignup}>
                Sign up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* mobile menu */}
      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              className={getNavItemClass(isActive(item.href), 'mobile')}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        <div className="my-2 border-t border-gray-200" />

        {/* mobile auth */}
        {status === AUTH_STATUS.LOADING && (
          <p className="px-2 text-xs text-gray-500">Checking session…</p>
        )}

        {status !== AUTH_STATUS.LOADING && isAuth && (
          <div className="flex flex-col gap-2 px-2">
            <span className="text-xs text-gray-500">
              Hello,&nbsp;
              <span className="font-medium text-slate-900">{userEmail}</span>!
            </span>
            <Button
              size="sm"
              variant="flat"
              className="self-start bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200"
              onPress={onSignout}
            >
              Sign out
            </Button>
          </div>
        )}

        {status !== AUTH_STATUS.LOADING && !isAuth && (
          <div className="flex flex-col gap-2 px-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => {
                setIsMenuOpen(false);
                onOpenLogin();
              }}
              className="self-start"
            >
              Login
            </Button>
            <Button
              size="sm"
              color="primary"
              onPress={() => {
                setIsMenuOpen(false);
                onOpenSignup();
              }}
              className="self-start"
            >
              Sign up
            </Button>
          </div>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
