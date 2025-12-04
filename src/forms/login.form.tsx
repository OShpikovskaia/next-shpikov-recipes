'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Form, Input } from '@heroui/react';

import { signinWithCredantionals } from '@/actions/signin';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: LoginFormProps) => {
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

    const result = await signinWithCredantionals(formData.email, formData.password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Login failed');
      return;
    }

    onClose();
    window.location.reload();
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
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value) return 'Email is required';
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
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return 'Password is required';
          return null;
        }}
      />

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="flex w-full items-center justify-end gap-4 pt-8">
        <Button variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isLoading={isSubmitting}>
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
