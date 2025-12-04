'use server';

import { signIn } from '@/auth/auth';

interface SignInResult {
  success: boolean;
  error?: string;
}

export const signinWithCredantionals = async (
  email: string,
  password: string,
): Promise<SignInResult> => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result || result?.error) {
      const errorCode = result.error;

      if (errorCode === 'CredentialsSignin') {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      return {
        success: false,
        error: 'Failed to sign in. Please try again.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Authorize error:', error);
    return {
      success: false,
      error: 'Internal error during sign in',
    };
  }
};
