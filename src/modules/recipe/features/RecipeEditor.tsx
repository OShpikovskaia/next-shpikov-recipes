'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from '@heroui/react';

import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';
import type { IRecipe } from '@/modules/recipe/model/type';
import {
  type IngredientField,
  type RecipeFormData,
  RecipeFormFields,
} from '@/modules/recipe/ui/RecipeFormFields';

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

  const { ingredients } = useIngredientStore();
  const { addRecipe, updateRecipe } = useRecipeStore();
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

  const handleSubmit = async (formDataNative: FormData) => {
    startTransition(async () => {
      setError(null);

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, formDataNative)
        : await addRecipe(formDataNative);

      if (result.success) {
        setFormData(initialState);
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
    <Form action={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-6">
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
    </Form>
  );
};

export default RecipeEditor;
