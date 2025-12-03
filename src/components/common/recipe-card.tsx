'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import { UNIT_ABBREVIATIONS } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useRecipeStore } from '@/store/recipe.store';
import type { IRecipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: IRecipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { removeRecipe } = useRecipeStore();
  const { isAuth } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeRecipe(recipe.id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    });
  };

  const getUnitLabel = (unit: string) => {
    const unitOption = UNIT_ABBREVIATIONS.find((option) => option.value === unit);
    return unitOption ? unitOption.label : unit.toLowerCase();
  };

  const ingredientsPreview = recipe.ingredients.slice(0, 3);
  const remainingCount = recipe.ingredients.length - ingredientsPreview.length;

  return (
    <Card className="flex h-full w-full max-w-xs flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/recipes/${recipe.id}`} className="flex flex-1 flex-col">
        <div className="relative h-40 w-full bg-gray-100">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={`Image for recipe "${recipe.name}"`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
              No image
            </div>
          )}
        </div>

        <CardHeader className="flex items-start justify-between px-4 pt-4 pb-2 text-black">
          <h2 className="line-clamp-1 text-lg font-semibold">{recipe.name}</h2>
        </CardHeader>

        <CardBody className="flex flex-1 flex-col gap-3 px-4 pb-2 text-black">
          <p className="line-clamp-2 text-sm text-gray-600">
            {recipe.description || 'No description yet'}
          </p>

          <div>
            <h3 className="mb-1 text-sm font-semibold">Ingredients</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {ingredientsPreview.map((ing) => (
                <li key={ing.id} className="flex justify-between gap-2">
                  <span className="flex-1 truncate">{ing.ingredient.name}</span>
                  <span className="shrink-0 text-gray-500">
                    {ing.quantity} {getUnitLabel(ing.ingredient.unit)}
                  </span>
                </li>
              ))}
              {remainingCount > 0 && (
                <li className="text-xs text-gray-400">
                  + {remainingCount} more ingredient{remainingCount > 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        </CardBody>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
        <Link href={`/recipes/${recipe.id}/details`}>
          <Button color="primary" variant="ghost" size="sm">
            Details
          </Button>
        </Link>

        {isAuth && (
          <div className="flex gap-2">
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Button color="primary" variant="light" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={handleDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;
