// src/routes/comiclist/+page.server.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ url }) {
  try {
    const sortColumn = url.searchParams.get('sort') || 'title';
    const sortOrder = url.searchParams.get('order') || 'asc';

    // Extract filter parameters
    const binLocation = url.searchParams.get('binLocation') || '';
    const title = url.searchParams.get('title') || '';
    const coverDateStart = url.searchParams.get('coverDateStart') || '';
    const coverDateEnd = url.searchParams.get('coverDateEnd') || '';

    console.log('Received filter parameters:', { binLocation, title, coverDateStart, coverDateEnd });

    // Build the where clause based on provided filters
    const where = {};

    if (binLocation) {
      where.binLocation = binLocation;
    }

    if (title) {
      where.title = {
        contains: title,
        // mode: 'insensitive', // Removed since SQLite doesn't support it
      };
    }

    if (coverDateStart || coverDateEnd) {
      where.coverDate = {};
      if (coverDateStart) {
        where.coverDate.gte = coverDateStart; // Adjusted based on schema
      }
      if (coverDateEnd) {
        where.coverDate.lte = coverDateEnd; // Adjusted based on schema
      }
    }

    const comics = await prisma.comic.findMany({
      where,
      orderBy: {
        [sortColumn]: sortOrder,
      },
    });

    return { comics };
  } catch (error) {
    console.error('Error fetching comics:', error);
    return { comics: [] };
  }
}
