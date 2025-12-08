'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Form } from '@heroui/react';

import { signupUser } from '@/modules/auth/model/server-actions';

import SignupFormFields from '../ui/SignupFormFields';

interface SignupFeatureProps {
  onClose: () => void;
}

const SignupFeature = ({ onClose }: SignupFeatureProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signupUser(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (response?.error) {
        setError('Login failed after sign up');
        return;
      }

      router.refresh();
      onClose();
    });
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <SignupFormFields
        email={formData.email}
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        error={error}
        isPending={isPending}
        onEmailChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
        onPasswordChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
        onConfirmPasswordChange={(value) =>
          setFormData((prev) => ({ ...prev, confirmPassword: value }))
        }
        onCancel={onClose}
      />
    </Form>
  );
};

export default SignupFeature;
