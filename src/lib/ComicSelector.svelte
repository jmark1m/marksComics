<!-- ComicSelector.svelte -->
<script>
    import { getComicDetails } from '$lib/comicVineApi.js';
  
    export let comics = [];
  
    async function handleComicClick(comic) {
  console.log('Selected comic:', comic);

  try {
    const urlParts = comic.api_detail_url.split('/');
    const comicId = urlParts[urlParts.length - 2];
    const comicDetails = await getComicDetails(comicId);
    console.log('Comic details:', comicDetails);

    const comicData = {
      title: comicDetails.volume.name,
      issue_number: comicDetails.issue_number,
      cover_date: comicDetails.cover_date,
      volume_name: comicDetails.volume.name,
      volume_id: comicDetails.volume.id,
      volume_url: comicDetails.volume.site_detail_url,
      site_url: comicDetails.site_detail_url,
      comic_url: comicDetails.site_detail_url,
      description: comicDetails.description,
      image_url: comicDetails.image.thumb_url,
      image_url_tiny: comicDetails.image.tiny_url,
      bin_location: comics.bin_location,
    };

    console.log('Comic data:', comicData);

    const response = await fetch('/api/comic/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comicData),
    });

    if (response.ok) {
      console.log('Comic added successfully');
    } else {
      console.error('Error adding comic:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching comic details:', error);
  }
}
  </script>
  
  <div class="comic-selector">
    {#each comics as comic}
      <div class="comic-item" on:click={() => handleComicClick(comic)}>
        <img src={comic.image.medium_url} alt={comic.name} />
        <p>{comic.name}</p>
        <p>Issue #{comic.issue_number}</p>
      </div>
    {/each}
  </div>
  
  <style>
    .comic-selector {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 20px;
    }
  
    .comic-item {
      cursor: pointer;
      text-align: center;
    }
  
    .comic-item img {
      width: 100%;
      height: auto;
      object-fit: cover;
      margin-bottom: 10px;
    }
  </style>