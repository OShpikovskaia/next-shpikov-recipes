import { getRecipes } from '@/modules/recipe/model/server-actions';
import RecipesListSection from '@/modules/recipe/widgets/RecipesListSection';

export const revalidate = 60;

export default async function Home() {
  const result = await getRecipes();
  const recipes = result.success ? result.recipes : [];

  return <RecipesListSection initialRecipes={recipes} />;
}
