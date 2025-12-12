import type { Metadata } from 'next';

import {
  getPublicRecipeById,
  getPublicRecipeIdsForBuild,
} from '@/modules/recipe/model/public-queries';
import RecipeDetails from '@/modules/recipe/ui/RecipeDetails';
import { PrivateRecipeGate } from '@/modules/recipe/widgets/PrivateRecipeGate';
import { siteConfig } from '@/shared/config/site.config';

interface PageProps {
  params: { id: string };
}

export const revalidate = 60;

export default async function RecipeDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const publicRecipe = await getPublicRecipeById(id);

  if (publicRecipe) {
    return <RecipeDetails recipe={publicRecipe} />;
  }

  return <PrivateRecipeGate id={id} />;
}

export async function generateStaticParams() {
  const ids = await getPublicRecipeIdsForBuild(20);
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const recipe = await getPublicRecipeById(id);

  if (!recipe) {
    return {
      title: `Recipe | ${siteConfig.title}`,
      description: siteConfig.description,
    };
  }

  return {
    title: `${recipe.name} | ${siteConfig.title}`,
    description: recipe.description || siteConfig.description,
  };
}
