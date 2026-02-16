'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import LoginModal from '@/modules/auth/ui/LoginModal';
import SignupModal from '@/modules/auth/ui/SignupModal';
import { siteConfig } from '@/shared/config/site.config';
import Header from '@/shared/ui/Header/Header';

export const AuthHeader = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSignout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleOpenSignup = () => {
    setIsSignupOpen(true);
  };

  return (
    <>
      <Header
        navItems={siteConfig.navItems}
        isAuth={isAuth}
        status={status}
        userEmail={session?.user?.email ?? null}
        onSignout={handleSignout}
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
      />

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
