'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Form, Input } from '@heroui/react';

import { signupUser } from '@/actions/signup';

interface SignupFormProps {
  onClose: () => void;
}

const SignupForm = ({ onClose }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Enter email"
        type="email"
        value={formData.email}
        classNames={{
          inputWrapper: 'bg-dafault-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        isDisabled={isPending}
        validate={(value) => {
          if (!value) return 'Email is required';
          if (!validateEmail(value)) return 'Email not corrected';
          return null;
        }}
      />
      <Input
        aria-label="Password"
        isRequired
        name="password"
        placeholder="Enter password"
        type="password"
        value={formData.password}
        classNames={{
          inputWrapper: 'bg-dafault-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        isDisabled={isPending}
        validate={(value) => {
          if (!value) return 'Password is required';
          if (value.length < 6) return 'The password must be at least 6 characters long.';
          return null;
        }}
      />
      <Input
        aria-label="confirmPassword"
        isRequired
        name="confirmPassword"
        placeholder="Enter confirm password"
        type="password"
        value={formData.confirmPassword}
        classNames={{
          inputWrapper: 'bg-dafault-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        isDisabled={isPending}
        validate={(value) => {
          if (!value) return 'Confirm password is required';
          if (value !== formData.password) return "The passwords don't match";
          return null;
        }}
      />

      {error && <p className="text-danger pt-2 text-sm">{error}</p>}

      <div className="flex w-full items-center justify-end gap-4 pt-8">
        <Button variant="light" onPress={onClose} isDisabled={isPending}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isDisabled={isPending}>
          Sign up
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
