'use client';

import type { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { HeroUIProvider } from '@heroui/react';

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </SessionProvider>
  );
};

export default Providers;
