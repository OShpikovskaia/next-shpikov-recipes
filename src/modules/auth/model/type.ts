export interface SignInResult {
  success: boolean;
  error?: string;
}

export type SignupResult = { success: true } | { success: false; error: string };

export interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
