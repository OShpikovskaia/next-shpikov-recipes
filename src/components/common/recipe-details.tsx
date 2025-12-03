'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import type { getRecipeById } from '@/actions/recipe';
import { formatUnitLabel, splitDescriptionLines } from '@/utils/recipe-utils';

type RecipeResult = NonNullable<Awaited<ReturnType<typeof getRecipeById>>>;

interface RecipeDetailsProps {
  recipe: RecipeResult;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  const descriptionLines = splitDescriptionLines(recipe.description);
  const ingredientCount = recipe.ingredients.length;
  const hasSteps = descriptionLines.length > 1;

  const heroDescription =
    descriptionLines[0] ?? 'This recipe does not have a description yet. Check back soon!';

  return (
    <div className="space-y-8">
      <Button as={Link} href="/" variant="light" size="sm" className="w-fit">
        ← Back to recipes
      </Button>

      <section className="grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {recipe.image ? (
            <Image src={recipe.image} alt={recipe.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{recipe.name}</h1>
            <p className="text-base text-gray-600">{heroDescription}</p>
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
          <CardBody className="bg-default-100 grid gap-px p-0 md:grid-cols-2">
            {ingredientCount === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">No ingredients added yet.</p>
            )}

            {recipe.ingredients.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-white px-4 py-3 text-sm"
              >
                <span className="flex-1">{item.ingredient.name}</span>
                <span className="shrink-0 text-gray-500">
                  {item.quantity} {formatUnitLabel(item.ingredient.unit)}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {hasSteps && (
        <section>
          <Card>
            <CardHeader className="text-base font-medium">Steps</CardHeader>
            <CardBody>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-700">
                {descriptionLines.map((line, index) => (
                  <li key={index} className="leading-relaxed">
                    {line}
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
