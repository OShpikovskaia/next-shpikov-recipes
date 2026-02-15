import { ALLOWED_IMAGE_HOSTNAME } from '@/shared/config/images';

export function getImageUrlError(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'Invalid URL';
  }

  if (url.protocol !== 'https:') return 'Only https:// links are allowed';

  if (url.hostname.toLowerCase() !== ALLOWED_IMAGE_HOSTNAME) {
    return 'Image must be from images.pexels.com';
  }

  return null;
}
