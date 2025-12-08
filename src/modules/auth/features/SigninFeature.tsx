'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from '@heroui/react';

import { signinWithCredentials } from '../model/signin-client';
import LoginFormFields from '../ui/LoginFormFields';

interface SigninFeatureProps {
  onClose: () => void;
}

const SigninFeature = ({ onClose }: SigninFeatureProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signinWithCredentials(formData.email, formData.password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Login failed');
      return;
    }

    onClose();
    router.refresh();
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <LoginFormFields
        email={formData.email}
        password={formData.password}
        error={error}
        isSubmitting={isSubmitting}
        onEmailChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
        onPasswordChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
        onCancel={onClose}
      />
    </Form>
  );
};

export default SigninFeature;
