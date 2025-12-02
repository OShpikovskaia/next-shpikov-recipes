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

  return (
    <Card className="flex h-[480px] w-full max-w-md min-w-[254px] flex-col">
      <div className="h-48 overflow-hidden">
        {recipe.imageUrl ? (
          <div className="group relative h-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
            <Image
              src={recipe.imageUrl}
              alt="Image for recipe"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      <CardHeader className="flex items-center justify-between text-black">
        <h2 className="text-xl font-bold">{recipe.name}</h2>
      </CardHeader>

      <CardBody className="flex-1 text-black">
        <p className="line-clamp-6 text-gray-600">{recipe.description || 'Без описания'}</p>
        <h3 className="mt-4 font-semibold">Ingredients:</h3>
        <ul className="max-h-24 list-disc overflow-y-auto pl-5">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id}>
              {ing.ingredient.name}: {ing.quantity} {getUnitLabel(ing.ingredient.unit)}
            </li>
          ))}
        </ul>
      </CardBody>

      {isAuth && (
        <div className="flex justify-end gap-2 p-4">
          <Link href={`/recipes/${recipe.id}`}>
            <Button color="primary" variant="light">
              Edit
            </Button>
          </Link>
          <Button color="danger" variant="light" onPress={handleDelete} isLoading={isPending}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RecipeCard;
