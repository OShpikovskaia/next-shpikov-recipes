import { useState } from 'react';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';

import { TrashIcon } from '@/shared/ui/icons/TrashIcon';

const DeleteIngredientButton = ({
  id,
  onDelete,
  isDisabled,
}: {
  id: string;
  onDelete: (id: string) => Promise<void>;
  isDisabled: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePress = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Tooltip
      color={isDisabled ? 'default' : 'danger'}
      content={isDisabled ? "Can't delete" : 'Delete'}
    >
      <span className="inline-flex">
        <Button
          isIconOnly
          size="sm"
          color="danger"
          variant="light"
          className="rounded-full"
          isLoading={isDeleting}
          isDisabled={isDisabled || isDeleting}
          onPress={handlePress}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </span>
    </Tooltip>
  );
};

export default DeleteIngredientButton;
