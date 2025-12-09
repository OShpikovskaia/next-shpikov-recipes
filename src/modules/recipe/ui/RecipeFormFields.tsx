'use client';

import { Button, Input, Select, SelectItem, Switch, Textarea } from '@heroui/react';

export interface IngredientField {
  id: string;
  ingredientId: string;
  quantity: number | null;
}

export interface RecipeFormData {
  name: string;
  description: string;
  imageUrl: string;
  steps: string;
  isPublic: boolean;
}

interface IngredientOption {
  id: string;
  name: string;
}

interface RecipeFormFieldsProps {
  error: string | null;
  formData: RecipeFormData;
  onChangeFormField: <K extends keyof RecipeFormData>(field: K, value: RecipeFormData[K]) => void;

  ingredientFields: IngredientField[];
  ingredientsOptions: IngredientOption[];
  maxIngredients: number;
  canAddIngredient: boolean;

  onAddIngredientField: () => void;
  onRemoveIngredientField: (id: string) => void;
  onIngredientChange: (
    id: string,
    field: keyof IngredientField,
    value: string | number | null,
  ) => void;

  isEditMode: boolean;
  isPending: boolean;
}

export const RecipeFormFields = ({
  error,
  formData,
  onChangeFormField,
  ingredientFields,
  ingredientsOptions,
  maxIngredients,
  canAddIngredient,
  onAddIngredientField,
  onRemoveIngredientField,
  onIngredientChange,
  isEditMode,
  isPending,
}: RecipeFormFieldsProps) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
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
          onChange={(e) => onChangeFormField('name', e.target.value)}
          validate={(value) => (!value ? 'Name is requered' : null)}
        />

        <Textarea
          name="description"
          label="Short description"
          placeholder="Enter short description (optional)"
          minRows={3}
          maxRows={6}
          value={formData.description}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onChange={(e) => onChangeFormField('description', e.target.value)}
        />

        <Textarea
          name="steps"
          label="Steps"
          placeholder="Write each step on a new line. We'll number them for you automatically (optional)."
          value={formData.steps}
          onChange={(e) => onChangeFormField('steps', e.target.value)}
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
          onChange={(e) => onChangeFormField('imageUrl', e.target.value)}
        />
        <Switch
          isSelected={formData.isPublic}
          onValueChange={(nextValue) => onChangeFormField('isPublic', nextValue)}
        >
          Visible to everyone
        </Switch>
      </div>

      <section className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <div className="flex items-center gap-3">
            <p className="text-default-400 text-xs">
              Up to {maxIngredients} ingredients per recipe.
            </p>
            <Button
              type="button"
              color="primary"
              variant="flat"
              size="sm"
              isDisabled={!canAddIngredient}
              onPress={onAddIngredientField}
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
                    onChange={(e) => onIngredientChange(field.id, 'ingredientId', e.target.value)}
                  >
                    {(ingredientsOptions || []).map((ingredient) => (
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
                      onIngredientChange(
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
                      onPress={() => onRemoveIngredientField(field.id)}
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
      <div className="mt-8 flex flex-col">
        <Button color="primary" type="submit" className="w-full" isLoading={isPending}>
          {isEditMode ? 'Save changes' : 'Create recipe'}
        </Button>
      </div>
    </div>
  );
};
