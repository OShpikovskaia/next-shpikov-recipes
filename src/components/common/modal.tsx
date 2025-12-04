'use client';

import type { ReactNode } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomModal = ({ isOpen, onClose, title, children, size = 'xs' }: CustomModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: 'w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 rounded-2xl',
        wrapper: 'items-center',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b">
          <h3 className="text-x1 font-semibold text-black">{title}</h3>
        </ModalHeader>
        <ModalBody className="space-y4 py-6">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
