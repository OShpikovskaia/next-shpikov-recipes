'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';

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
    name: initialRecipe?.name || initialState.name,
    description: initialRecipe?.description || initialState.description,
    imageUrl: initialRecipe?.imageUrl || initialState.imageUrl,
  });

  const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
    initialRecipe?.ingredients
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
    if (ingredientFields.length < 10) {
      setIngredientFields((prev) => [...prev, makeField()]);
    }
  };

  const handleRemoveIngredientField = (id: string) => {
    if (ingredientFields.length > 1) {
      setIngredientFields(ingredientFields.filter((field) => field.id !== id));
    }
  };

  const handleIngredientChange = (
    id: string,
    field: keyof IIngredientField,
    value: string | number | null,
  ) => {
    setIngredientFields(ingredientFields.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setError(null);

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, formData)
        : await addRecipe(formData);

      if (result.success) {
        setIngredientFields([{ id: '0', ingredientId: '', quantity: null }]);
        router.push('/');
        setFormData(initialState);
      } else {
        setError(result.error || 'Error saving recipe');
      }
    });
  };

  return (
    <Form className="w-[450px]" action={handleSubmit}>
      {error && <p className="mb-4 text-red-500">{error}</p>}

      <Input
        isRequired
        name="name"
        placeholder="Enter name of recipe"
        type="text"
        value={formData.name}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        validate={(value) => (!value ? 'Name is requered' : null)}
      />

      <Input
        name="description"
        placeholder="Enter description (optional)"
        type="text"
        value={formData.description}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        name="imageUrl"
        placeholder="URL of image (optional)"
        type="url"
        value={formData.imageUrl}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
      />

      <div className="w-full space-y-2">
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Select
              isRequired
              name={`ingredient_${index}`}
              placeholder="Select an ingredient"
              selectedKeys={field.ingredientId ? [field.ingredientId] : []}
              classNames={{
                trigger: 'bg-default-100 w-full',
                innerWrapper: 'text-sm',
                value: 'truncate',
                selectorIcon: 'text-black',
              }}
              onChange={(e) => handleIngredientChange(field.id, 'ingredientId', e.target.value)}
            >
              {ingredients.map((ingredient) => (
                <SelectItem key={ingredient.id} className="text-black">
                  {ingredient.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              name={`quantity_${index}`}
              placeholder="Quantity"
              type="number"
              value={field.quantity !== null ? field.quantity.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100 w-full',
                input: 'text-sm focus:outline-none',
              }}
              className="w-[100px]"
              onChange={(e) =>
                handleIngredientChange(
                  field.id,
                  'quantity',
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
              validate={(value) =>
                !value || parseFloat(value) <= 0 ? 'The quantity must be greater than 0' : null
              }
            />
            {ingredientFields.length > 1 && (
              <Button
                color="danger"
                variant="light"
                onPress={() => handleRemoveIngredientField(field.id)}
                className="w-[50px]"
              >
                -
              </Button>
            )}
          </div>
        ))}

        {ingredientFields.length < 10 && (
          <Button color="primary" variant="flat" onPress={handleAddIngredientField}>
            +
          </Button>
        )}
      </div>

      <div className="mt-4 flex w-full items-center justify-end">
        <Button color="primary" type="submit" isLoading={isPending}>
          {initialRecipe ? 'Save' : 'Add recipe'}
        </Button>
      </div>
    </Form>
  );
};

export default RecipeForm;
