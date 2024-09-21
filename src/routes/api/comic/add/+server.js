import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
  const {
    title,
    issue_number,
    cover_date,
    volume_name,
    volume_id,
    volume_url,
    site_url,
    comic_url,
    description,
    image_url,
    image_url_tiny,
    bin_location,
  } = await request.json();

  console.log('/comic/add route');
  console.log('title:', title);
  console.log('issue_number:', issue_number);
  console.log('cover_date:', cover_date);
  console.log('volume_name:', volume_name);
  console.log('volume_id:', volume_id);
  console.log('volume_url:', volume_url);
    console.log('site_url:', site_url);
  console.log('comic_url:', comic_url);
  console.log('description:', description);
  console.log('image_url:', image_url);
  console.log('image_url_tiny:', image_url_tiny);
  console.log('bin_location:', bin_location);

  await prisma.comic.create({
    data: {
      title,
      issue_number: issue_number,
      coverDate: cover_date,
      volumeName: volume_name,
      volumeId: volume_id,
      volumeUrl: volume_url,
      siteUrl: site_url,
      comicUrl: comic_url,
      description,
      imageUrl: image_url,
      imageUrlTiny: image_url_tiny,
      binLocation: bin_location,
    },
  });

  return new Response(JSON.stringify({ message: 'Comic added successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}