'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { Form } from '@heroui/form';
import type { Selection } from '@heroui/react';
import { Button, Input, Select, SelectItem } from '@heroui/react';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { useIngredientStore } from '@/store/ingredient.store';
import type { IngredientsFormData } from '@/types/form-data';

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

const IngredientForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IngredientsFormData>(INITIAL_STATE);

  const { addIngredient } = useIngredientStore();

  const [isPending, startTransition] = useTransition();

  const handleSelectionChange =
    (field: keyof IngredientsFormData) =>
    (keys: Selection) => {
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
    <Form className="w-full space-y-4" onSubmit={handleSubmit}>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <Input
        aria-label="Name"
        isRequired
        name="name"
        placeholder="Enter the ingredient name"
        type="text"
        value={formData.name}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        validate={(value) => (!value ? 'Name is required' : null)}
      />

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Select
          isRequired
          name="category"
          placeholder="Category"
          selectedKeys={formData.category ? new Set([formData.category]) : new Set([])}
          classNames={{
            trigger: 'bg-default-100 w-full',
            innerWrapper: 'text-sm',
            value: 'truncate',
            selectorIcon: 'text-black',
          }}
          onSelectionChange={handleSelectionChange('category')}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <SelectItem key={option.value} className="text-black">
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          isRequired
          name="unit"
          placeholder="Unit"
          selectedKeys={formData.unit ? new Set([formData.unit]) : new Set([])}
          classNames={{
            trigger: 'bg-default-100 w-full',
            innerWrapper: 'text-sm',
            value: 'truncate',
            selectorIcon: 'text-black',
          }}
          onSelectionChange={handleSelectionChange('unit')}
        >
          {UNIT_OPTIONS.map((option) => (
            <SelectItem key={option.value} className="text-black">
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <Input
          aria-label="PricePerUnit"
          isRequired
          name="pricePerUnit"
          placeholder="Enter the price per unit"
          type="text"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={formData.pricePerUnit}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onChange={(e) => setFormData((prev) => ({ ...prev, pricePerUnit: e.target.value }))}
          endContent={<span className="text-gray-500">$</span>}
          validate={(value) => {
            if (!value) return 'Price is required';
            const num = Number(value);
            if (Number.isNaN(num) || num < 0) return 'Price must be positive';
            return null;
          }}
        />
      </div>

      <Input
        aria-label="Description"
        name="description"
        placeholder="Enter the ingredient description"
        type="text"
        value={formData.description}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div className="flex w-full items-center justify-end">
        <Button color="primary" type="submit" isLoading={isPending}>
          Add ingredient
        </Button>
      </div>
    </Form>
  );
};

export default IngredientForm;
