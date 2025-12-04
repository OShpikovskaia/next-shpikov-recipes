'use client';

import type { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/react';

import type { EmptyStateVariant } from '@/config/empty-state.config';
import { EMPTY_STATE_CONFIG } from '@/config/empty-state.config';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  imageSrcOverride?: string;
  title?: string;
  description?: string;
  hideText?: boolean;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  size?: 'md' | 'lg';
}

const EmptyState: FC<PropsWithChildren<EmptyStateProps>> = ({
  variant = 'generic',
  imageSrcOverride,
  title,
  description,
  hideText = false,
  primaryActionLabel,
  primaryActionHref,
  children,
  size = 'lg',
}) => {
  const config = EMPTY_STATE_CONFIG[variant];

  const imageSrc = imageSrcOverride ?? config.imageSrc;
  const alt = config.alt;

  const finalTitle = title ?? config.defaultTitle;
  const finalDescription = description ?? config.defaultDescription;

  const isLarge = size === 'lg';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        isLarge ? 'gap-4 py-16' : 'gap-3 py-8'
      }`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={isLarge ? 260 : 200}
        height={isLarge ? 200 : 150}
        priority
      />

      {!hideText && (
        <>
          {finalTitle && <h1 className="text-xl font-semibold text-gray-900">{finalTitle}</h1>}
          {finalDescription && <p className="max-w-md text-sm text-gray-500">{finalDescription}</p>}
        </>
      )}

      {(primaryActionLabel && primaryActionHref) || children ? (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {primaryActionLabel && primaryActionHref && (
            <Button as={Link} href={primaryActionHref} color="primary" variant="flat">
              {primaryActionLabel}
            </Button>
          )}
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
