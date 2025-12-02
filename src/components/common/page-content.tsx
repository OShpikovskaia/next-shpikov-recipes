'use client';

import { usePathname } from 'next/navigation';
import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

import NotFoundPage from '@/app/not-found';
import { siteConfig } from '@/config/site.config';

const PageContent = () => {
  const pathname = usePathname();
  const pageContent = siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

  if (!pageContent) return <NotFoundPage />;

  const cleanHTML = DOMPurify.sanitize(pageContent.content);
  return <div>{parse(cleanHTML)}</div>;
};

export default PageContent;
