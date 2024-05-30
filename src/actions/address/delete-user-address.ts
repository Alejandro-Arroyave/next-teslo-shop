"use server";
import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    await prisma.userAddress.delete({ where: { userId } });
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user address");
  }
};
