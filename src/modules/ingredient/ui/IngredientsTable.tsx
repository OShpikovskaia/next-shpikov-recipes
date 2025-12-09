'use client';

import Image from 'next/image';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useIngredientsTableState } from '@/modules/ingredient/model/useIngredientsTableState';
import {
  formatPricePerUnit,
  getCategoryLabel,
  getUnitLabel,
} from '@/modules/ingredient/model/utils';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import { TrashIcon } from '@/shared/ui/icons/TrashIcon';
import { ListCountInfo } from '@/shared/ui/ListCountInfo';
import { SearchBar } from '@/shared/ui/SearchBar';

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading, error } = useIngredientStore();
  const { isAuth, status } = useAuthStore();

  const {
    searchValue,
    setSearchValue,
    sortDescriptor,
    setSortDescriptor,
    filteredAndSorted,
    hasAnyIngredients,
    isSearching,
  } = useIngredientsTableState({ ingredients });

  const isInitial = ingredients === null;

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Checking your access…</p>
      </div>
    );
  }

  if (!isAuth) {
    return <p className="text-danger mt-4 text-sm">You are not logged in.</p>;
  }

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
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        radius="lg"
        shadow="sm"
        isStriped
        selectionMode="none"
        classNames={{
          wrapper: 'rounded-2xl border border-default-200 bg-white overflow-x-auto',
          table: 'min-w-[640px]',
          thead: 'bg-default-50',
          th: 'text-xs font-semibold text-default-500 uppercase tracking-wide',
          tr: 'transition-colors',
          tbody: '[&>tr:hover]:bg-default-50',
          td: 'text-sm text-default-700 align-middle',
        }}
        topContent={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              className="w-full sm:max-w-md"
              size="sm"
              placeholder="Search ingredients by name or description..."
              aria-label="Search ingredients"
            />

            {hasAnyIngredients && (
              <ListCountInfo
                total={ingredients?.length ?? 0}
                visible={filteredAndSorted.length}
                label="ingredients"
                className="text-default-400 [&_span]:text-default-600"
              />
            )}
          </div>
        }
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting className="min-w-[120px]">
            Name
          </TableColumn>
          <TableColumn key="category" allowsSorting>
            Category
          </TableColumn>
          <TableColumn key="unit" allowsSorting>
            Unit
          </TableColumn>
          <TableColumn key="pricePerUnit" allowsSorting>
            Price per unit
          </TableColumn>
          <TableColumn key="description" className="min-w-[220px]">
            Description
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            !hasAnyIngredients ? (
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
            ) : isSearching ? (
              <p className="py-6 text-center text-xs text-gray-500">
                No ingredients match &quot;{searchValue.trim()}&quot;.
              </p>
            ) : null
          }
        >
          {filteredAndSorted.map(({ id, name, category, unit, pricePerUnit, description }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{getCategoryLabel(category)}</TableCell>
              <TableCell>{getUnitLabel(unit)}</TableCell>
              <TableCell>{formatPricePerUnit(pricePerUnit)}</TableCell>
              <TableCell className="max-w-xs truncate">{description || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Tooltip color="danger" content="Delete ingredient">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      aria-label={`Delete ingredient ${name}`}
                      className="rounded-full"
                      onPress={() => handleDelete(id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLoading && hasAnyIngredients && (
        <p className="text-default-400 text-xs">Updating ingredients…</p>
      )}
    </div>
  );
};

export default IngredientsTable;
