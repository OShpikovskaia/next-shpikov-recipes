'use server';

import type { IFormData } from '@/types/form-data';
import { saltAndHashPassword } from '@/utils/password';
import prisma from '@/utils/prisma';

export const signupUser = async (formData: IFormData) => {
  const { email, password, confirmPassword } = formData;
  if (password !== confirmPassword) return { error: "Passwords don't match" };
  if (password.length < 6) return { error: 'Passwords lenght must be 6 symbols minimum' };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    const pwHash = await saltAndHashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: pwHash },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Error signup', error);

    const message = error instanceof Error ? error.message : JSON.stringify(error);

    return { error: `Sign up failed: ${message}` };
  }
};
