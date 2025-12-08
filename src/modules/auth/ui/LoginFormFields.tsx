import { Button, Input } from '@heroui/react';

interface LoginFormFieldsProps {
  email: string;
  password: string;
  error: string | null;
  isSubmitting: boolean;

  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
}

const LoginFormFields = ({
  email,
  password,
  error,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onCancel,
}: LoginFormFieldsProps) => {
  return (
    <>
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Enter email"
        type="email"
        value={email}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => onEmailChange(e.target.value)}
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
        value={password}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => onPasswordChange(e.target.value)}
        validate={(value) => {
          if (!value) return 'Password is required';
          return null;
        }}
      />

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="flex w-full items-center justify-end gap-4 pt-8">
        <Button variant="light" type="button" onPress={onCancel}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isLoading={isSubmitting}>
          Login
        </Button>
      </div>
    </>
  );
};

export default LoginFormFields;
