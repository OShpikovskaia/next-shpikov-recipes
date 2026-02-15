'use client';

import { useState } from 'react';
import Image from 'next/image';

interface RecipeImageProps {
  src?: string | null;
  alt: string;
}

const RecipeImage = ({ src, alt }: RecipeImageProps) => {
  const [failed, setFailed] = useState(false);

  const showRemote = Boolean(src?.trim()) && !failed;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden bg-[#EFF6FF]">
      {showRemote ? (
        <Image
          src={src!.trim()}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, 100vw"
          priority
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src="/empty-states/recipe-image-placeholder.svg"
          alt="Recipe image placeholder"
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 320px, 100vw"
          priority={false}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default RecipeImage;
