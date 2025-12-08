'use client';

import CustomModal from '@/shared/ui/Modal';

import SignupFeature from '../features/SignupFeature';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Sign up">
      <SignupFeature onClose={onClose} />
    </CustomModal>
  );
};

export default SignupModal;
