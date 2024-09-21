<script>
  export let data;
  import { searchComics } from '$lib/comicVineApi.js';
  import MenuHeader from '$lib/MenuHeader.svelte';
  import ComicSelector from '$lib/ComicSelector.svelte';

  let title = '';
  let issue_number = '';
  let bin_location = '';
  let finalResults = [];
  let offset = 0;
  let isLoading = false;

  async function addComic(event) {
    event.preventDefault();
    offset = 0;
    finalResults = [];

    const query = `${title} ${issue_number}`;
    const results = await searchComics(query, offset);

    results.bin_location = bin_location;
    console.log('Final results:', results);
    finalResults = [...finalResults, ...results];
    offset += results.length;
  }

  async function loadMoreComics() {
    isLoading = true;

    const query = `${title} ${issue_number}`;
    const results = await searchComics(query, offset);

    results.bin_location = bin_location;
    console.log('Final results:', results);
    finalResults = [...finalResults, ...results];
    offset += results.length;

    isLoading = false;
  }

  async function selectComic(comic) {
    // Extract additional details from the selected comic and add them to your database
    const response = await fetch('/api/comic/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: comic.name,
        issue_number: parseInt(comic.issue_number),
        bin_location: comic.bin_location,
      }),
    });

    //... handle response and update UI
    finalResults = []; // Clear the search results after selecting a comic
    offset = 0; // Reset the offset
  }

  let comicId = '';
</script>

<MenuHeader />

<h2>Add a new comic:</h2>

<form on:submit|preventDefault={addComic}>
  <div>
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={title} required />
  </div>
  <div>
    <label for="issue_number">Issue Number:</label>
    <input type="number" id="issue_number" bind:value={issue_number} required />
  </div>
  <div>
    <label for="bin_location">Bin Location:</label>
    <input type="text" id="bin_location" bind:value={bin_location} />
  </div>
  <button type="submit">Search Comics</button>
</form>

{#if finalResults.length > 0}
  <h3>Select the correct comic:</h3>
  <ComicSelector comics={finalResults} on:comicSelected={selectComic} />

  {#if !isLoading}
    <button on:click={loadMoreComics}>Load More</button>
  {:else}
    <p>Loading...</p>
  {/if}
{/if}