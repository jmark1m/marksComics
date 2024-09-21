import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
  try {
    const comics = await prisma.comic.findMany();
    return { comics };
  } catch (error) {
    console.error('Error fetching comics:', error);
    return { comics: [] };
  }
}