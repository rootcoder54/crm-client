import { prisma } from "@/lib/db";

export const getUserByUserName = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  } catch {
    return null;
  }
};


export const getUserById = async (id: string|undefined) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const createUser = async (
  username: string,
  name: string,
  hashpassword: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hashpassword,
      },
    });
  } catch {
    return null;
  }
};
