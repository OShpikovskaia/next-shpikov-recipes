'use client';

import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { getRecipeById } from '@/modules/recipe/model/server-actions';
import { formatUnitLabel } from '@/modules/recipe/model/utils';

import RecipeImage from './RecipeImage';

type RecipeWithIngredients = NonNullable<Awaited<ReturnType<typeof getRecipeById>>>;

interface RecipeDetailsProps {
  recipe: RecipeWithIngredients;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  const ingredientCount = recipe.ingredients.length;

  const shortDescription =
    recipe.description?.trim() ||
    'This recipe does not have a description yet. You can add it later.';

  const steps = (recipe.steps ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const hasSteps = steps.length > 0;

  return (
    <div className="space-y-8">
      <Button as={Link} href="/" variant="flat" color="primary" size="sm" className="w-fit">
        ← Back to recipes
      </Button>

      <section className="grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr]">
        <RecipeImage src={recipe.imageUrl} alt={`Image for recipe "${recipe.name}"`} />

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{recipe.name}</h1>
            <p className="mt-2 max-w-xl text-base text-gray-600">{shortDescription}</p>
          </div>

          <p className="text-sm tracking-wide text-gray-400 uppercase">
            {ingredientCount} ingredient{ingredientCount === 1 ? '' : 's'}
          </p>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader className="flex items-center justify-between text-base font-medium">
            <span>Ingredients</span>
            <span className="text-sm text-gray-400">{ingredientCount} total</span>
          </CardHeader>

          <CardBody className="p-0">
            {ingredientCount === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No ingredients added yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recipe.ingredients.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <span className="flex-1 text-gray-800">{item.ingredient.name}</span>
                    <span className="shrink-0 text-gray-500">
                      {item.quantity} {formatUnitLabel(item.ingredient.unit)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>

      {/* Steps */}
      {hasSteps && (
        <section>
          <Card>
            <CardHeader className="text-base font-medium">Steps</CardHeader>
            <CardBody>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-700">
                {steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
};

export default RecipeDetails;
