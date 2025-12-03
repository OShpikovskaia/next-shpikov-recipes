'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';

import type { getRecipeById } from '@/actions/recipe';
import { UNIT_ABBREVIATIONS } from '@/constants/select-options';

type RecipeById = NonNullable<Awaited<ReturnType<typeof getRecipeById>>>;

interface RecipeDetailsProps {
  recipe: RecipeById;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  const ingredientCount = recipe.ingredients.length;

  const descriptionText = recipe.description ?? '';
  const descriptionLines = descriptionText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* back link */}
      <Button as={Link} href="/" variant="light" size="sm" className="mb-2 w-fit">
        ← Back to recipes
      </Button>

      {/* hero */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="md:w-1/4">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.name}
              width={220}
              height={220}
              className="aspect-square w-full rounded-xl object-cover"
            />
          ) : (
            <div className="bg-default-100 aspect-square w-full rounded-xl" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{recipe.name}</h1>

          {descriptionText && (
            <p className="text-default-500 text-sm">{descriptionLines[0] ?? descriptionText}</p>
          )}

          <p className="text-default-400 text-xs">
            {ingredientCount} ingredient{ingredientCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* ingredients */}
      <Card>
        <CardHeader className="flex items-center justify-between text-base font-medium">
          <span>Ingredients</span>
          <span className="text-default-400 text-xs">{ingredientCount} total</span>
        </CardHeader>
        <CardBody className="bg-default-100 grid gap-px p-0 md:grid-cols-2">
          {ingredientCount === 0 && (
            <p className="text-default-400 px-4 py-3 text-sm">No ingredients added yet.</p>
          )}

          {recipe.ingredients.map((item) => {
            const unitOption = UNIT_ABBREVIATIONS.find((opt) => opt.value === item.ingredient.unit);
            const unitLabel = unitOption?.label ?? item.ingredient.unit.toLowerCase();

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-white px-4 py-3 text-sm"
              >
                <span className="flex-1">{item.ingredient.name}</span>
                <span className="text-default-500 shrink-0">
                  {item.quantity} {unitLabel}
                </span>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* steps (if exist) */}
      {descriptionLines.length > 1 && (
        <Card>
          <CardHeader className="text-base font-medium">Steps</CardHeader>
          <CardBody>
            <ol className="text-default-600 list-decimal space-y-3 pl-5 text-sm">
              {descriptionLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ol>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default RecipeDetails;
