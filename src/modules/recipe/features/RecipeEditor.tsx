'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useIngredientStore } from '@/modules/ingredient/model/store';
import type { IRecipe } from '@/modules/recipe/model/types';
import {
  type IngredientField,
  type RecipeFormData,
  RecipeFormFields,
} from '@/modules/recipe/ui/RecipeFormFields';

import { useRecipeActions } from '../model/hooks/useRecipeActions';
import type { CreateRecipeInput } from '../model/server-actions';

interface RecipeEditorProps {
  initialRecipe?: IRecipe;
}

const MAX_INGREDIENTS = 10;

const initialState: RecipeFormData = {
  name: '',
  description: '',
  imageUrl: '',
  steps: '',
  isPublic: true,
};

const makeField = (overrides?: Partial<IngredientField>): IngredientField => ({
  id: crypto.randomUUID(),
  ingredientId: '',
  quantity: null,
  ...overrides,
});

const RecipeEditor = ({ initialRecipe }: RecipeEditorProps) => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RecipeFormData>({
    name: initialRecipe?.name ?? initialState.name,
    description: initialRecipe?.description ?? initialState.description,
    imageUrl: initialRecipe?.imageUrl ?? initialState.imageUrl,
    steps: initialRecipe?.steps ?? initialState.steps,
    isPublic: initialRecipe?.isPublic ?? initialState.isPublic,
  });

  const [ingredientFields, setIngredientFields] = useState<IngredientField[]>(
    initialRecipe?.ingredients && initialRecipe.ingredients.length > 0
      ? initialRecipe.ingredients.map((ing) =>
          makeField({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
          }),
        )
      : [makeField()],
  );

  const ingredients = useIngredientStore((state) => state.ingredients);
  const { addRecipe, editRecipe: updateRecipe } = useRecipeActions();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddIngredientField = () => {
    setIngredientFields((prev) => (prev.length >= MAX_INGREDIENTS ? prev : [...prev, makeField()]));
  };

  const handleRemoveIngredientField = (id: string) => {
    setIngredientFields((prev) => (prev.length <= 1 ? prev : prev.filter((f) => f.id !== id)));
  };

  const handleIngredientChange = (
    id: string,
    field: keyof IngredientField,
    value: string | number | null,
  ) => {
    setIngredientFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleChangeFormField = <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildInput = (): CreateRecipeInput => ({
    name: formData.name,
    description: formData.description,
    steps: formData.steps,
    imageUrl: formData.imageUrl.trim() ? formData.imageUrl.trim() : null,
    isPublic: formData.isPublic,
    ingredients: ingredientFields
      .filter((f) => f.ingredientId && f.quantity !== null)
      .map((f) => ({
        ingredientId: f.ingredientId,
        quantity: f.quantity as number,
      })),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      setError(null);

      const input = buildInput();
      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, input)
        : await addRecipe(input);

      if (result.success) {
        setFormData(initialState);
        setIngredientFields([makeField()]);
        router.push('/');
      } else {
        setError(result.error || 'Error saving recipe');
      }
    });
  };

  const isEditMode = Boolean(initialRecipe);
  const canAddIngredient = ingredientFields.length < MAX_INGREDIENTS;
  const ingredientsOptions = ingredients || [];

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <RecipeFormFields
        error={error}
        formData={formData}
        onChangeFormField={handleChangeFormField}
        ingredientFields={ingredientFields}
        ingredientsOptions={ingredientsOptions}
        maxIngredients={MAX_INGREDIENTS}
        canAddIngredient={canAddIngredient}
        onAddIngredientField={handleAddIngredientField}
        onRemoveIngredientField={handleRemoveIngredientField}
        onIngredientChange={handleIngredientChange}
        isEditMode={isEditMode}
        isPending={isPending}
      />
    </form>
  );
};

export default RecipeEditor;
