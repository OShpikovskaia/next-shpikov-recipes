import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

import { siteConfig } from '@/shared/config/site.config';

interface RouteContentSectionProps {
  pathname: string;
}

const RouteContentSection = ({ pathname }: RouteContentSectionProps) => {
  const pageContent = siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

  if (!pageContent) {
    notFound();
  }

  const cleanHTML = DOMPurify.sanitize(pageContent.content);

  return <div>{parse(cleanHTML)}</div>;
};

export default RouteContentSection;
