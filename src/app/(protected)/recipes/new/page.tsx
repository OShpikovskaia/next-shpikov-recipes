'use client';

import RecipeForm from '@/forms/recipe-form';

const NewRecipePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Create new recipe</h1>
      <RecipeForm />
    </div>
  );
};

export default NewRecipePage;
