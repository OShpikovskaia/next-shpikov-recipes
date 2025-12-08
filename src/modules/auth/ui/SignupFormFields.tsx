import { Button, Input } from '@heroui/react';

interface SignupFormFieldsProps {
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  isPending: boolean;

  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onCancel: () => void;
}

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignupFormFields = ({
  email,
  password,
  confirmPassword,
  error,
  isPending,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onCancel,
}: SignupFormFieldsProps) => {
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
        isDisabled={isPending}
        validate={(value) => {
          if (!value) return 'Email is required';
          if (!validateEmail(value)) return 'Email is invalid';
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
        value={confirmPassword}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        isDisabled={isPending}
        validate={(value) => {
          if (!value) return 'Confirm password is required';
          if (value !== password) return "The passwords don't match";
          return null;
        }}
      />

      {error && <p className="text-danger pt-2 text-sm">{error}</p>}

      <div className="flex w-full items-center justify-end gap-4 pt-8">
        <Button variant="light" type="button" onPress={onCancel} isDisabled={isPending}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isDisabled={isPending}>
          Sign up
        </Button>
      </div>
    </>
  );
};

export default SignupFormFields;
