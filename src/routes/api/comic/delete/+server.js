import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE({ request }) {
  const { id } = await request.json();

  console.log('/comic/delete route');
  console.log('id:', id);

  try {
    await prisma.comic.delete({
      where: {
        id: parseInt(id),
      },
    });

    return new Response(JSON.stringify({ message: 'Comic deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting comic:', error);

    return new Response(JSON.stringify({ message: 'Failed to delete comic' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}