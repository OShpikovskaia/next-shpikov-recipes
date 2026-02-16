interface RecipeImageUrlHintProps {
  className?: string;
}

export const RecipeImageUrlHint = ({ className }: RecipeImageUrlHintProps) => {
  return (
    <p className={className ?? 'mt-1 text-xs text-gray-500'}>
      Find an image on Pexels and paste the <span className="font-medium">direct image URL</span>{' '}
      (must start with <span className="font-mono">https://images.pexels.com/</span>). Right-click
      the image → <span className="font-medium">Copy image address</span>.{' '}
      <a
        href="https://www.pexels.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-gray-700"
      >
        Open Pexels
      </a>
    </p>
  );
};
