'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card } from '@heroui/react';

import { useAuthStore } from '@/store/auth.store';
import { useRecipeStore } from '@/store/recipe.store';
import type { IRecipe } from '@/types/recipe';
import { formatUnitLabel } from '@/utils/recipe-utils';

interface RecipeCardProps {
  recipe: IRecipe;
}

const INGREDIENT_PREVIEW_LIMIT = 3;

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

  const ingredientsPreview = recipe.ingredients.slice(0, INGREDIENT_PREVIEW_LIMIT);
  const remainingCount = Math.max(recipe.ingredients.length - ingredientsPreview.length, 0);

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/recipes/${recipe.id}`}
        className="text-foreground flex flex-1 flex-col no-underline"
        aria-label={`View details for ${recipe.name}`}
      >
        <div className="relative h-44 w-full bg-gray-100">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={`Image for recipe "${recipe.name}"`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-black">
          <h2 className="line-clamp-1 text-lg font-semibold">{recipe.name}</h2>
          <p className="line-clamp-2 text-sm text-gray-600">
            {recipe.description || 'No description yet'}
          </p>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Ingredients
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {ingredientsPreview.map((ing) => (
                <li key={ing.id} className="flex justify-between gap-2">
                  <span className="flex-1 truncate">{ing.ingredient.name}</span>
                  <span className="shrink-0 text-gray-500">
                    {ing.quantity} {formatUnitLabel(ing.ingredient.unit)}
                  </span>
                </li>
              ))}
              {remainingCount > 0 && (
                <li className="text-xs text-gray-400">
                  +{remainingCount} more ingredient{remainingCount > 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
        <Link href={`/recipes/${recipe.id}`}>
          <Button color="primary" variant="flat" size="sm">
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
