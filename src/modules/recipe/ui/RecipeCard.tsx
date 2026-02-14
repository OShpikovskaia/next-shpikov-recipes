'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import clsx from 'clsx';

import { useAuthStore } from '@/modules/auth/model/store';
import type { IRecipe } from '@/modules/recipe/model/types';
import { formatUnitLabel } from '@/modules/recipe/model/utils/client';

import { useRecipeActions } from '../model/hooks/useRecipeActions';
import RecipeImage from './RecipeImage';

interface RecipeCardProps {
  recipe: IRecipe;
}

const INGREDIENT_PREVIEW_LIMIT = 3;

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { removeRecipe } = useRecipeActions();
  const isAuth = useAuthStore((state) => state.isAuth);
  const session = useAuthStore((state) => state.session);
  const [isPending, startTransition] = useTransition();

  const currentUserId = session?.user?.id ?? null;
  const isOwner = isAuth && recipe.authorId && recipe.authorId === currentUserId;

  const visibilityLabel = recipe.isPublic ? 'Public' : isOwner ? 'Private' : null;

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
        <RecipeImage src={recipe.imageUrl} alt={`Image for recipe "${recipe.name}"`} />

        <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-black">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-1 text-lg font-semibold">{recipe.name}</h2>
            {visibilityLabel && (
              <span
                className={clsx(
                  'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                  recipe.isPublic
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-100 text-slate-600',
                )}
              >
                {visibilityLabel}
              </span>
            )}
          </div>

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

        {isAuth && isOwner && (
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
