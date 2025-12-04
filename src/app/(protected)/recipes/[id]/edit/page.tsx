'use client';

import { useParams } from 'next/navigation';

import RecipeForm from '@/forms/recipe-form';
import { useRecipeStore } from '@/store/recipe.store';

const EditRecipePage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { recipes, isLoading, error } = useRecipeStore();

  const isInitial = recipes === null;
  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;

  const recipe = hasRecipes ? recipes.find((item) => item.id === id) : undefined;

  if (isInitial || isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error && !recipe) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!recipe && hasRecipes) {
    return <p className="text-center text-red-500">Recipe not found</p>;
  }

  if (!recipe) {
    return <p className="text-center text-red-500">You don&apos;t have any recipes yet.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">{recipe.name}</h1>
      <RecipeForm initialRecipe={recipe} />
    </div>
  );
};

export default EditRecipePage;
