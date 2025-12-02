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
          <NavbarItem key={item.href} isActive={isActive}>
            <Link
              color="foreground"
              href={item.href}
              className={`rounded-md border px-3 py-1 transition-colors duration-200 ${
                isActive
                  ? 'border-blue-400 text-blue-500'
                  : 'text-foreground border-transparent hover:border-blue-300 hover:text-blue-400'
              } `}
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
    <Navbar style={{ height: `${layoutConfig.headerHeight}` }} className="dark">
      <NavbarBrand>
        <Link href="/" className="flex gap-1">
          <Logo />
          <p className="font-bold text-inherit">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {getNavItems()}
      </NavbarContent>

      <NavbarContent justify="end">
        {isAuth && <p>Hello, {session?.user?.email}!</p>}
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : !isAuth ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="secondary"
                href="#"
                variant="flat"
                onPress={() => setIsLoginOpen(true)}
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onPress={() => setIsSignupOpen(true)}
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem className="hidden lg:flex">
            <Button as={Link} color="secondary" href="#" variant="flat" onPress={handleSignout}>
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
