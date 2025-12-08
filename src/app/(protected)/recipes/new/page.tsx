import RecipeEditor from '@/modules/recipe/features/RecipeEditor';

const NewRecipePage = () => {
  return (
    <div className="flex w-full flex-col p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Create new recipe</h1>
      <RecipeEditor />
    </div>
  );
};

export default NewRecipePage;
