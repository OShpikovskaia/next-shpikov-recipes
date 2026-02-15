import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

import { ALLOWED_IMAGE_HOSTNAME } from '@/shared/config/images';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: ALLOWED_IMAGE_HOSTNAME }],
  },
};

export default withBundleAnalyzer(nextConfig);
