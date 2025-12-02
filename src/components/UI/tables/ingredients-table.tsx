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

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';

type Option = {
  readonly value: string;
  readonly label: string;
};

const getOptionLabel = (value: string, options: readonly Option[]) => {
  const option = options.find((option) => option.value === value);
  return option ? option.label : value;
};

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore();
  const { isAuth } = useAuthStore();

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  const isDataLoaded = isAuth && !isLoading;

  if (!isAuth) return <p>You are not logged in.</p>;

  return !isDataLoaded ? (
    <p>Loading data...</p>
  ) : (
    <Table
      aria-label="Ingredients table"
      classNames={{
        wrapper: 'mt-4',
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
      <TableBody>
        {ingredients.map(({ id, name, category, unit, pricePerUnit, description }) => (
          <TableRow key={id}>
            <TableCell>{name}</TableCell>
            <TableCell>{getOptionLabel(category, CATEGORY_OPTIONS)}</TableCell>
            <TableCell>{getOptionLabel(unit, UNIT_OPTIONS)}</TableCell>
            <TableCell>{pricePerUnit ? `${pricePerUnit} $` : '-'}</TableCell>
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
  );
};

export default IngredientsTable;
