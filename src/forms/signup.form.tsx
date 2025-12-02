'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
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

  const validateEmail = (email: string) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signupUser(formData);
    onClose();
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
        validate={(value) => {
          if (!value) return 'Confirm password is required';
          if (value !== formData.password) return "The passwords don't match";
          return null;
        }}
      />

      <div className="flex w-[100%] items-center justify-end gap-4 pt-8">
        <Button variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Sign up
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
