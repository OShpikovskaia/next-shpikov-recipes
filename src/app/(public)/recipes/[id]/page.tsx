import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getRecipeById } from '@/actions/recipe';
import RecipeDetails from '@/components/common/recipe-details';
import { siteConfig } from '@/config/site.config';

type ParamsPromise = Promise<{ id: string }>;

const fetchRecipeOrThrow = async (params: ParamsPromise) => {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return recipe;
};

const RecipeDetailsPage = async ({ params }: { params: ParamsPromise }) => {
  const recipe = await fetchRecipeOrThrow(params);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <RecipeDetails recipe={recipe} />
    </div>
  );
};

export const generateMetadata = async ({
  params,
}: {
  params: ParamsPromise;
}): Promise<Metadata> => {
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

export default RecipeDetailsPage;
