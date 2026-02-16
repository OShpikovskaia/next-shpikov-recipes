'use client';

import { useState } from 'react';
import Image from 'next/image';
import cn from 'clsx';

interface RecipeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

const RecipeImage = ({ src, alt, className }: RecipeImageProps) => {
  const [failed, setFailed] = useState(false);

  const showRemote = Boolean(src?.trim()) && !failed;

  return (
    <div className={cn('relative aspect-[4/3] w-full overflow-hidden bg-[#EFF6FF]', className)}>
      {showRemote ? (
        <Image
          src={src!.trim()}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src="/empty-states/recipe-image-placeholder.svg"
          alt="Recipe image placeholder"
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default RecipeImage;
