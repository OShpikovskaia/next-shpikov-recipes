'use client';

import { useParams } from 'next/navigation';

import RecipeForm from '@/forms/recipe-form';
import { useRecipeStore } from '@/store/recipe.store';

const EditRecipePage = () => {
  const { id } = useParams();
  const { recipes, isLoading, error } = useRecipeStore();

  const recipe = recipes.find((recipe) => recipe.id === id);

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!isLoading && recipes.length > 0 && !recipe) {
    return <p className="text-center text-red-500">Recipe not found</p>;
  }

  if (!recipe) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">{recipe.name}</h1>
      <RecipeForm initialRecipe={recipe} />
    </div>
  );
};

export default EditRecipePage;
