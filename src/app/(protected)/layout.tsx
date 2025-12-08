import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/modules/auth/model/auth';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return <section>{children}</section>;
}
