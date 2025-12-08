import { notFound } from 'next/navigation';

import { getRecipeById } from '@/modules/recipe/model/server-actions';
import RecipeDetails from '@/modules/recipe/ui/RecipeDetails';

interface RecipeDetailsSectionProps {
  id: string;
}

export const RecipeDetailsSection = async ({ id }: RecipeDetailsSectionProps) => {
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <RecipeDetails recipe={recipe} />
    </div>
  );
};
