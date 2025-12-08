import type { Metadata } from 'next';

import { getRecipeById } from '@/modules/recipe/model/server-actions';
import { RecipeDetailsSection } from '@/modules/recipe/widgets/RecipeDetailsSection';
import { siteConfig } from '@/shared/config/site.config';

interface PageProps {
  params: { id: string };
}

export default async function RecipeDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <RecipeDetailsSection id={id} />;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    return {
      title: `Recipe not found | ${siteConfig.title}`,
      description: siteConfig.description,
    };
  }

  return {
    title: `${recipe.name} | ${siteConfig.title}`,
    description: recipe.description || siteConfig.description,
  };
};
