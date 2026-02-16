'use client';

import type { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { HeroUIProvider } from '@heroui/system';

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </SessionProvider>
  );
};

export default Providers;
