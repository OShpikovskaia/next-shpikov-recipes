import { getIngredients } from '@/modules/ingredient/model/server-actions';
import RecipeEditor from '@/modules/recipe/features/RecipeEditor';

export default async function NewRecipePage() {
  const result = await getIngredients();

  const ingredientsOptions = result.success
    ? result.ingredients.map((i) => ({
        id: i.id,
        name: i.name,
      }))
    : [];
  return (
    <div className="flex w-full flex-col p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Create new recipe</h1>
      <RecipeEditor ingredientsOptions={ingredientsOptions} />
    </div>
  );
}
