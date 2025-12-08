'use client';

import { Button, Input, Select, type Selection, SelectItem } from '@heroui/react';

import type { IngredientsFormData } from '../model/type';

type Option = {
  value: string;
  label: string;
};

interface IngredientFormFieldsProps {
  formError: string | null;
  formData: IngredientsFormData;
  isPending: boolean;

  categoryOptions: readonly Option[];
  unitOptions: readonly Option[];

  onNameChange: (value: string) => void;
  onCategoryChange: (keys: Selection) => void;
  onUnitChange: (keys: Selection) => void;
  onPricePerUnitChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const IngredientFormFields = ({
  formError,
  formData,
  isPending,
  categoryOptions,
  unitOptions,
  onNameChange,
  onCategoryChange,
  onUnitChange,
  onPricePerUnitChange,
  onDescriptionChange,
}: IngredientFormFieldsProps) => {
  return (
    <>
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
        onChange={(e) => onNameChange(e.target.value)}
        validate={(value) => (!value ? 'Name is required' : null)}
      />

      <div className="flex w-full flex-col items-start gap-2 md:flex-row">
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
          onSelectionChange={onCategoryChange}
        >
          {categoryOptions.map((option) => (
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
          onSelectionChange={onUnitChange}
        >
          {unitOptions.map((option) => (
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
          onChange={(e) => onPricePerUnitChange(e.target.value)}
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
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <div className="flex w-full">
        <Button color="primary" type="submit" isLoading={isPending} className="w-full">
          Add ingredient
        </Button>
      </div>
    </>
  );
};

export default IngredientFormFields;
