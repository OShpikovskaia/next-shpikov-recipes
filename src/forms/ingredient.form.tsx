'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { Form } from '@heroui/form';
import type { Selection } from '@heroui/react';
import { Button, Input, Select, SelectItem } from '@heroui/react';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { useIngredientStore } from '@/store/ingredient.store';
import type { IngredientsFormData } from '@/types/form-data';

const INITIAL_STATE = {
  name: '',
  category: '',
  unit: '',
  pricePerUnit: '',
  description: '',
};
const IngredientForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IngredientsFormData>(INITIAL_STATE);

  const { addIngredient } = useIngredientStore();

  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (keys: Selection) => {
    const value = Array.from(keys)[0]?.toString() ?? '';
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleUnitChange = (keys: Selection) => {
    const value = Array.from(keys)[0]?.toString() ?? '';
    setFormData((prev) => ({ ...prev, unit: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await addIngredient(formData);
      const storeError = useIngredientStore.getState().error;
      if (storeError) {
        setError(storeError);
      } else {
        setError(null);
        setFormData(INITIAL_STATE);
      }
    });
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      {error && <p className="mb-4 text-red-500">{error}</p>}
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
        validate={(value) => {
          if (!value) return 'Name is required';
          return null;
        }}
      />
      <div className="flex w-full gap-2">
        <div className="w-1/3">
          <Select
            isRequired
            name="category"
            placeholder="Category"
            defaultSelectedKeys={formData.category ? [formData.category] : []}
            classNames={{
              trigger: 'bg-default-100 w-full',
              innerWrapper: 'text-sm',
              value: 'truncate',
              selectorIcon: 'text-black',
            }}
            onSelectionChange={handleCategoryChange}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} className="text-black">
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="w-1/3">
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
            onSelectionChange={handleUnitChange}
          >
            {UNIT_OPTIONS.map((option) => (
              <SelectItem key={option.value} className="text-black">
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-1/3">
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
