'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, SelectItem, Textarea } from '@heroui/react';

import { useIngredientStore } from '@/store/ingredient.store';
import { useRecipeStore } from '@/store/recipe.store';
import type { IRecipe } from '@/types/recipe';

interface RecipeFormProps {
  initialRecipe?: IRecipe;
}

interface IIngredientField {
  id: string;
  ingredientId: string;
  quantity: number | null;
}

const MAX_INGREDIENTS = 10;

const initialState = {
  name: '',
  description: '',
  imageUrl: '',
};

const makeField = (overrides?: Partial<IIngredientField>): IIngredientField => ({
  id: crypto.randomUUID(),
  ingredientId: '',
  quantity: null,
  ...overrides,
});

const RecipeForm = ({ initialRecipe }: RecipeFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialRecipe?.name ?? initialState.name,
    description: initialRecipe?.description ?? initialState.description,
    imageUrl: initialRecipe?.imageUrl ?? initialState.imageUrl,
  });

  const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
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
    if (ingredientFields.length >= MAX_INGREDIENTS) return;
    setIngredientFields((prev) => [...prev, makeField()]);
  };

  const handleRemoveIngredientField = (id: string) => {
    if (ingredientFields.length <= 1) return;
    setIngredientFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleIngredientChange = (
    id: string,
    field: keyof IIngredientField,
    value: string | number | null,
  ) => {
    setIngredientFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setError(null);

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, formData)
        : await addRecipe(formData);

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

  return (
    <Form action={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-16">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="w-full space-y-4">
        <Input
          isRequired
          name="name"
          type="text"
          label="Name"
          placeholder="Enter name of recipe"
          value={formData.name}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          validate={(value) => (!value ? 'Name is requered' : null)}
        />

        <Textarea
          name="description"
          label="Description"
          placeholder="Enter description (optional)"
          minRows={3}
          maxRows={6}
          value={formData.description}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Textarea
          name="steps"
          label="Steps"
          placeholder="Write each step on a new line. We'll number them for you automatically."
        />
        <p className="mt-1 text-xs text-gray-500">
          One step per line. Don&apos;t add numbers – we&apos;ll do it for you.
        </p>

        <Input
          name="imageUrl"
          type="url"
          label="Image URL"
          placeholder="URL of image (optional)"
          value={formData.imageUrl}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      <section className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <div className="flex items-center gap-3">
            <p className="text-default-400 text-xs">
              Up to {MAX_INGREDIENTS} ingredients per recipe.
            </p>
            <Button
              type="button"
              color="primary"
              variant="flat"
              size="sm"
              isDisabled={!canAddIngredient}
              onPress={handleAddIngredientField}
            >
              + Add ingredient
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="border-default-100 rounded-xl border bg-white p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <Select
                    isRequired
                    name={`ingredient_${index}`}
                    label="Ingredient"
                    placeholder="Select an ingredient"
                    selectedKeys={field.ingredientId ? [field.ingredientId] : []}
                    classNames={{
                      trigger: 'bg-default-100 w-full',
                      innerWrapper: 'text-sm',
                      value: 'truncate',
                      selectorIcon: 'text-black',
                    }}
                    onChange={(e) =>
                      handleIngredientChange(field.id, 'ingredientId', e.target.value)
                    }
                  >
                    {(ingredients || []).map((ingredient) => (
                      <SelectItem key={ingredient.id} className="text-black">
                        {ingredient.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="min-w-0 flex-1 md:max-w-xs">
                  <Input
                    isRequired
                    name={`quantity_${index}`}
                    type="number"
                    label="Quantity"
                    placeholder="0"
                    value={field.quantity !== null ? field.quantity.toString() : ''}
                    classNames={{
                      inputWrapper: 'bg-default-100',
                      input: 'text-sm focus:outline-none',
                    }}
                    onChange={(e) =>
                      handleIngredientChange(
                        field.id,
                        'quantity',
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    validate={(value) =>
                      !value || parseFloat(value) <= 0
                        ? 'The quantity must be greater than 0'
                        : null
                    }
                  />
                </div>

                <div className="flex items-center justify-end">
                  {ingredientFields.length > 1 && (
                    <Button
                      type="button"
                      isIconOnly
                      color="danger"
                      variant="light"
                      aria-label="Remove ingredient"
                      onPress={() => handleRemoveIngredientField(field.id)}
                    >
                      –
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 flex w-full justify-end">
        <Button color="primary" type="submit" isLoading={isPending} className="px-8">
          {isEditMode ? 'Save changes' : 'Create recipe'}
        </Button>
      </div>
    </Form>
  );
};

export default RecipeForm;
