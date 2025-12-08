import type { Metadata } from 'next';

import RouteContentSection from '@/modules/static-page/widgets/RouteContentSection';
import { siteConfig } from '@/shared/config/site.config';
import PageContent from '@/shared/ui/PageContent';

export const metadata: Metadata = {
  title: `About | ${siteConfig.title}`,
  description: siteConfig.description,
};

const AboutPage = () => {
  return (
    <PageContent>
      <RouteContentSection pathname="/about" />
    </PageContent>
  );
};

export default AboutPage;
