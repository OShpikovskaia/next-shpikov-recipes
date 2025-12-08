'use client';

import { signIn } from 'next-auth/react';

import type { SignInResult } from './type';

export const signinWithCredentials = async (
  email: string,
  password: string,
): Promise<SignInResult> => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      const errorCode = result?.error;

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
  } catch {
    return {
      success: false,
      error: 'Internal error during sign in',
    };
  }
};
