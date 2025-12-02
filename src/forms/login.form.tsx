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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signinWithCredantionals(formData.email, formData.password);
    onClose();
    // temporary hack -> need to get session here
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
          inputWrapper: 'bg-dafault-100',
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
          inputWrapper: 'bg-dafault-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return 'Password is required';
          return null;
        }}
      />

      <div className="flex w-[100%] items-center justify-end gap-4 pt-8">
        <Button variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
