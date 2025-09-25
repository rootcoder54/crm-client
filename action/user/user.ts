import { db } from "@/lib/db";

export const getUserByUserName = async (username: string) => {
  try {
    const user = await db.user.findUnique({
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
    const user = await db.user.findUnique({
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
    const user = await db.user.create({
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
