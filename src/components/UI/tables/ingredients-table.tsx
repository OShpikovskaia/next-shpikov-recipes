'use client';

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
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <p className="text-danger mt-4 text-sm">You are not logged in.</p>;
  }

  if (isLoading) {
    return <p className="text-default-500 mt-4 text-sm">Loading ingredients...</p>;
  }

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  const hasIngredients = ingredients.length > 0;

  return (
    <div className="mt-4 space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Table
        aria-label="Ingredients table"
        classNames={{
          wrapper: 'border border-gray-100 rounded-2xl',
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
            hasIngredients
              ? undefined
              : "You don't have any ingredients yet. Use “Add ingredient” to create one."
          }
        >
          {ingredients.map(({ id, name, category, unit, pricePerUnit, description }) => (
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
    </div>
  );
};

export default IngredientsTable;
