'use client';

import { usePathname } from 'next/navigation';

import { siteConfig } from '@/shared/config/site.config';

const PageTitle = () => {
  const pathname = usePathname();
  const currentNavItem = siteConfig.navItems.find((item) => item.href === pathname);
  const pageTitle = currentNavItem ? currentNavItem.label : siteConfig.title;

  return (
    <div className="flex w-full justify-center">
      <h1 className="text-3xl font-bold">{pageTitle}</h1>
    </div>
  );
};

export default PageTitle;
