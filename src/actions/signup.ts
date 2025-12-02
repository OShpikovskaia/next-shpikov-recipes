'use server';

import type { IFormData } from '@/types/form-data';
import { saltAndHashPassword } from '@/utils/password';
import prisma from '@/utils/prisma';

export type SignupResult = { success: true } | { success: false; error: string };

export const signupUser = async (formData: IFormData): Promise<SignupResult> => {
  const { email, password, confirmPassword } = formData;

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords don't match" };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password length must be at least 6 characters',
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    const pwHash = await saltAndHashPassword(password);

    await prisma.user.create({
      data: { email, password: pwHash },
    });

    return { success: true };
  } catch (error) {
    console.error('Error signup', error);
    return {
      success: false,
      error: 'Unexpected error during sign up. Please try again later.',
    };
  }
};
