import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getRecipeById } from '@/actions/recipe';
import RecipeDetails from '@/components/common/recipe-details';
import { siteConfig } from '@/config/site.config';

type ParamsPromise = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: ParamsPromise }): Promise<Metadata> {
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
}

const RecipeDetailsPage = async ({ params }: { params: ParamsPromise }) => {
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <RecipeDetails recipe={recipe} />
    </main>
  );
};

export default RecipeDetailsPage;
