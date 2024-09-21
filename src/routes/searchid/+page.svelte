<script>
    export let data;

    import { getComicDetails } from '$lib/comicVineApi.js';
    import MenuHeader from '$lib/MenuHeader.svelte';

    let comicId = '';
    let bin_location = '';

    async function addComicById(event) {
    event.preventDefault();

    console.log('Adding comic with ID:', comicId);

    try {
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
      bin_location: bin_location,
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

<MenuHeader />

<h2>Add a comic by ID:</h2>
<form on:submit|preventDefault={addComicById}>
  <div>
    <label for="comicId">Comic ID:</label>
    <input type="text" id="comicId" bind:value={comicId} required />
  </div>
  <div>
    <label for="bin_location">Bin Location:</label>
    <input type="text" id="bin_location" bind:value={bin_location} />
  </div>
  <button type="submit">Add Comic</button>
</form>
  