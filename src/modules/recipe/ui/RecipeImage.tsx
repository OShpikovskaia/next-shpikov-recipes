'use client';

import Image from 'next/image';

interface RecipeImageProps {
  src?: string | null;
  alt: string;
}

const RecipeImage = ({ src, alt }: RecipeImageProps) => {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden bg-[#EFF6FF]">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, 100vw"
        />
      ) : (
        <Image
          src="/empty-states/recipe-image-placeholder.svg"
          alt="Recipe image placeholder"
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 320px, 100vw"
        />
      )}
    </div>
  );
};

export default RecipeImage;
