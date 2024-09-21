import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT({ request }) {
  const { id } = await request.json();

  console.log('/comic/increment route');
  console.log('id:', id);

  try {
    const updatedComic = await prisma.comic.update({
      where: { id: parseInt(id) },
      data: {
        quantityOwned: { increment: 1 },
      },
    });

    console.log('Updated comic:', updatedComic);

    return new Response(JSON.stringify({ message: 'Quantity incremented successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error incrementing quantity:', error);
    return new Response(JSON.stringify({ message: 'Failed to increment quantity' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}