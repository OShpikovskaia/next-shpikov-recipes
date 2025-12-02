'use client';

import CustomModal from '@/components/common/modal';
import LoginForm from '@/forms/login.form';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Login">
      <LoginForm onClose={onClose} />
    </CustomModal>
  );
};

export default LoginModal;
