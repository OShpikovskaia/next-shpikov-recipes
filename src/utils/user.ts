import prisma from './prisma';

export const getUserFromDb = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};
