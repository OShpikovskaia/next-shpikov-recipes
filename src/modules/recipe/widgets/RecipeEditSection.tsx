import { notFound } from 'next/navigation';

import { getRecipeByIdForOwner } from '@/modules/recipe/model/server-actions';

import RecipeEditor from '../features/RecipeEditor';

export const RecipeEditSection = async ({ id }: { id: string }) => {
  const recipe = await getRecipeByIdForOwner(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-3xl font-bold">{recipe.name}</h1>
      <RecipeEditor initialRecipe={recipe} />
    </div>
  );
};
