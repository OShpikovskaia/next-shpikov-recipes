'use client';

import CustomModal from '@/shared/ui/Modal';

import SigninFeature from '../features/SigninFeature';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Login">
      <SigninFeature onClose={onClose} />
    </CustomModal>
  );
};

export default LoginModal;
