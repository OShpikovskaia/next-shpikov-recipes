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
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b">
          <h3 className="text-x1 text-background font-semibold text-black">{title}</h3>
        </ModalHeader>
        <ModalBody className="space-y4 py-6">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
