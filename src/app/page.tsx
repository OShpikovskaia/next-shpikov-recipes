import { getPublicRecipes } from '@/modules/recipe/model/public-queries';
import RecipesListSection from '@/modules/recipe/widgets/RecipesListSection';

export const revalidate = 60;

export default async function Home() {
  const recipes = await getPublicRecipes();
  return <RecipesListSection initialRecipes={recipes} />;
}
