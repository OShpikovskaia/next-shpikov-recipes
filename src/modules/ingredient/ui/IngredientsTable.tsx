'use client';

import Image from 'next/image';
import type { SortDescriptor } from '@heroui/react';
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

import {
  formatPricePerUnit,
  getCategoryLabel,
  getUnitLabel,
} from '@/modules/ingredient/model/utils';
import { TrashIcon } from '@/shared/ui/icons/TrashIcon';
import { ListCountInfo } from '@/shared/ui/ListCountInfo';
import { SearchBar } from '@/shared/ui/SearchBar';

import type { IIngredient } from '../model/type';

interface IngredientsTableProps {
  rows: IIngredient[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortDescriptor: SortDescriptor;
  onSortChange: (sort: SortDescriptor) => void;
  onDelete: (id: string) => void;
  currentUserId: string | null;
}

const IngredientsTable = ({
  rows,
  totalCount,
  isLoading,
  error,
  searchValue,
  onSearchChange,
  sortDescriptor,
  onSortChange,
  onDelete,
  currentUserId,
}: IngredientsTableProps) => {
  const hasAnyIngredients = totalCount > 0;
  const isSearching = searchValue.trim().length > 0;
  const visibleCount = rows.length;

  return (
    <div className="mt-4 space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Table
        aria-label="Ingredients table"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
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
              onChange={onSearchChange}
              className="w-full sm:max-w-md"
              size="sm"
              placeholder="Search ingredients by name or description..."
              aria-label="Search ingredients"
            />

            {hasAnyIngredients && (
              <ListCountInfo
                total={totalCount}
                visible={visibleCount}
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
          {rows.map(({ id, name, category, unit, pricePerUnit, description, authorId }) => {
            const canDelete = Boolean(currentUserId && authorId && authorId === currentUserId);

            const tooltipText = canDelete
              ? 'Delete ingredient'
              : 'Only the author can delete this ingredient';

            return (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{getCategoryLabel(category)}</TableCell>
                <TableCell>{getUnitLabel(unit)}</TableCell>
                <TableCell>{formatPricePerUnit(pricePerUnit)}</TableCell>
                <TableCell className="max-w-xs truncate">{description || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip color={canDelete ? 'danger' : 'default'} content={tooltipText}>
                      <span className="inline-flex">
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          aria-label={`Delete ingredient ${name}`}
                          className="rounded-full"
                          isDisabled={!canDelete}
                          onPress={() => {
                            if (!canDelete) return;
                            onDelete(id);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {isLoading && hasAnyIngredients && (
        <p className="text-default-400 text-xs">Updating ingredients…</p>
      )}
    </div>
  );
};

export default IngredientsTable;
