'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle } from '@heroui/navbar';

import { layoutConfig } from '@/shared/config/layout.config';
import { siteConfig } from '@/shared/config/site.config';

import { type SessionStatus } from '../../model/auth-status';
import DesktopAuthSlot from './DesktopAuthSlot';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import type { NavItem } from './types';

interface HeaderProps {
  navItems: readonly NavItem[];
  isAuth: boolean;
  status: SessionStatus;
  userEmail?: string | null;
  onSignout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

const Logo = () => <Image src="/logo.png" priority alt={siteConfig.title} width={26} height={26} />;

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

  const activePath = useMemo(() => path, [path]);

  return (
    <Navbar
      className="border-b border-gray-200 bg-white/80 backdrop-blur-md"
      maxWidth="xl"
      style={{ height: layoutConfig.headerHeight }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <p className="text-sm font-semibold text-slate-900">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <DesktopNav navItems={navItems} isAuth={isAuth} activePath={activePath} />

      <NavbarContent justify="end" className="items-center gap-3">
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        />

        <DesktopAuthSlot
          status={status}
          isAuth={isAuth}
          userEmail={userEmail}
          onSignout={onSignout}
          onOpenLogin={onOpenLogin}
          onOpenSignup={onOpenSignup}
        />
      </NavbarContent>

      <MobileMenu
        navItems={navItems}
        isAuth={isAuth}
        activePath={activePath}
        status={status}
        userEmail={userEmail}
        onSignout={onSignout}
        onOpenLogin={onOpenLogin}
        onOpenSignup={onOpenSignup}
        closeMenu={() => setIsMenuOpen(false)}
      />
    </Navbar>
  );
};

export default Header;
