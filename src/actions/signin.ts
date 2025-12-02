'use server';

import { signIn } from '@/auth/auth';

export const signinWithCredantionals = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return result;
  } catch (error) {
    console.error('Authorize error:', error);
    throw error;
  }
};
