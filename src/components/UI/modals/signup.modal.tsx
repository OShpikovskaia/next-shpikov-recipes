'use client';

import CustomModal from '@/components/common/modal';
import SignupForm from '@/forms/signup.form';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Sign up">
      <SignupForm onClose={onClose} />
    </CustomModal>
  );
};

export default SignupModal;
