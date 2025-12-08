'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { Form } from '@heroui/form';
import type { Selection } from '@heroui/react';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/modules/ingredient/model/select-options';
import { useIngredientStore } from '@/modules/ingredient/model/store';

import type { IngredientsFormData } from '../model/type';
import IngredientFormFields from '../ui/IngredientFormFields';

const INITIAL_STATE: IngredientsFormData = {
  name: '',
  category: '',
  unit: '',
  pricePerUnit: '',
  description: '',
};

const selectionToValue = (keys: Selection): string => {
  if (keys === 'all') return '';
  const [first] = Array.from(keys);
  return first?.toString() ?? '';
};

export const IngredientEditor = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IngredientsFormData>(INITIAL_STATE);

  const { addIngredient } = useIngredientStore();
  const [isPending, startTransition] = useTransition();

  const handleChangeField = (field: keyof IngredientsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectionChange = (field: 'category' | 'unit') => (keys: Selection) => {
    const value = selectionToValue(keys);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await addIngredient(formData);

      if (!result.success) {
        setFormError(result.error ?? 'Unable to add ingredient.');
        return;
      }

      setFormError(null);
      setFormData(INITIAL_STATE);
    });
  };

  return (
    <Form className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-16" onSubmit={handleSubmit}>
      <IngredientFormFields
        formError={formError}
        formData={formData}
        isPending={isPending}
        categoryOptions={CATEGORY_OPTIONS}
        unitOptions={UNIT_OPTIONS}
        onNameChange={(value) => handleChangeField('name', value)}
        onCategoryChange={handleSelectionChange('category')}
        onUnitChange={handleSelectionChange('unit')}
        onPricePerUnitChange={(value) => handleChangeField('pricePerUnit', value)}
        onDescriptionChange={(value) => handleChangeField('description', value)}
      />
    </Form>
  );
};
