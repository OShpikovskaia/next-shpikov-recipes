'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

import {
  formatPricePerUnit,
  getCategoryLabel,
  getUnitLabel,
} from '@/components/common/ingredient-utils';
import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading, error } = useIngredientStore();
  const { isAuth, status } = useAuthStore();

  if (status === 'loading') {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Checking your access…</p>
      </div>
    );
  }

  if (!isAuth) {
    return <p className="text-danger mt-4 text-sm">You are not logged in.</p>;
  }

  const isInitial = ingredients === null;
  const hasIngredients = Array.isArray(ingredients) && ingredients.length > 0;

  if (isInitial) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Loading ingredients...</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  return (
    <div className="mt-4 space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Table
        aria-label="Ingredients table"
        classNames={{
          wrapper: 'rounded-2xl border border-gray-100',
          table: 'w-full',
          th: 'text-black',
          td: 'text-black',
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Unit</TableColumn>
          <TableColumn>Price per unit</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            hasIngredients ? undefined : (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <Image
                  src="/empty-states/no-ingredients.svg"
                  alt="No ingredients yet"
                  width={160}
                  height={120}
                  className="mb-2 opacity-90"
                />

                <p className="text-sm font-medium text-gray-700">
                  You don&apos;t have any ingredients yet.
                </p>
                <p className="max-w-sm text-center text-xs text-gray-500">
                  Add your first ingredient to reuse it in recipes and keep prices in one place.
                </p>
              </div>
            )
          }
        >
          {ingredients?.map(({ id, name, category, unit, pricePerUnit, description }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{getCategoryLabel(category)}</TableCell>
              <TableCell>{getUnitLabel(unit)}</TableCell>
              <TableCell>{formatPricePerUnit(pricePerUnit)}</TableCell>
              <TableCell>{description || '-'}</TableCell>
              <TableCell>
                <Button color="danger" size="sm" onPress={() => handleDelete(id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLoading && hasIngredients && (
        <p className="text-default-400 text-xs">Updating ingredients…</p>
      )}
    </div>
  );
};

export default IngredientsTable;
