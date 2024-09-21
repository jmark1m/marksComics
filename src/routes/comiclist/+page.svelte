<script>
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import MenuHeader from '$lib/MenuHeader.svelte';

  export let data;

  // Sorting state
  let sortColumn = 'title';
  let sortOrder = 'asc';

  // Filter state
  let filters = {
      binLocation: '',
      title: '',
      coverDateStart: '',
      coverDateEnd: ''
  };

  // Subscribe to the page store to reactively get URL parameters
  const unsubscribePage = page.subscribe(($page) => {
      sortColumn = $page.url.searchParams.get('sort') || 'title';
      sortOrder = $page.url.searchParams.get('order') || 'asc';
      filters.binLocation = $page.url.searchParams.get('binLocation') || '';
      filters.title = $page.url.searchParams.get('title') || '';
      filters.coverDateStart = $page.url.searchParams.get('coverDateStart') || '';
      filters.coverDateEnd = $page.url.searchParams.get('coverDateEnd') || '';
  });

  // Cleanup the subscription on component destroy
  onDestroy(() => {
      unsubscribePage();
  });

  // Function to update the URL with current sort and filter parameters
  function updateFilters() {
      console.log('Updating filters:', filters);
      const params = new URLSearchParams();

      // Sorting parameters
      if (sortColumn) {
          params.set('sort', sortColumn);
          params.set('order', sortOrder);
      }

      // Filter parameters
      if (filters.binLocation) params.set('binLocation', filters.binLocation);
      if (filters.title) params.set('title', filters.title);
      if (filters.coverDateStart) params.set('coverDateStart', filters.coverDateStart);
      if (filters.coverDateEnd) params.set('coverDateEnd', filters.coverDateEnd);

      // Navigate to the updated URL, triggering a reload with new parameters
      goto(`?${params.toString()}`);
  }

  // Function to clear all filters
  function clearFilters() {
      filters = {
          binLocation: '',
          title: '',
          coverDateStart: '',
          coverDateEnd: ''
      };
      sortColumn = 'title';
      sortOrder = 'asc';
      updateFilters();
  }

  // Existing deleteComic function
  async function deleteComic(id) {
      const response = await fetch('/api/comic/delete', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
      });

      if (response.ok) {
          // Remove the deleted comic from the data.comics array
          data.comics = data.comics.filter(comic => comic.id !== id);
          alert('Comic deleted successfully');
      } else {
          alert('Failed to delete comic');
      }
  }

  // Existing incrementQuantity function
  async function incrementQuantity(id) {
      const response = await fetch('/api/comic/increment', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
      });

      if (response.ok) {
          // Find the comic in the data.comics array and increment its quantityOwned
          const comic = data.comics.find(comic => comic.id === id);
          if (comic) {
              comic.quantityOwned++;
          }
          alert('Quantity incremented successfully');
      } else {
          alert('Failed to increment quantity');
      }
  }

  // Existing sortComics function, updated to integrate with filters
  function sortComics(column) {
      if (sortColumn === column) {
          // Toggle sort order if the same column is clicked
          sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
          // Set new sort column and default to ascending order
          sortColumn = column;
          sortOrder = 'asc';
      }
      updateFilters();
  }

  // Handle form submission
  function handleSubmit(event) {
      event.preventDefault(); // Prevent default form submission (page reload)
      updateFilters();
  }
</script>

<MenuHeader />
<h3>Total Comics In This List = {data.comics.length}</h3>

<!-- Filter Section -->
<form class="filters" on:submit={handleSubmit}>
  <label>
      Bin Location:
      <select bind:value={filters.binLocation} on:change={() => { /* No immediate update */ }}>
          <option value="">All</option>
          <!-- Dynamically populate bin locations -->
          {#each [...new Set(data.comics.map(comic => comic.binLocation))] as bin}
              <option value={bin}>{bin}</option>
          {/each}
      </select>
  </label>

  <label>
      Title:
      <input 
          type="text" 
          bind:value={filters.title} 
          placeholder="Search by title" 
          on:keydown={(e) => {
              if (e.key === 'Enter') {
                  handleSubmit(e);
              }
          }} 
      />
  </label>

  <label>
      Cover Date Start:
      <input 
          type="date" 
          bind:value={filters.coverDateStart} 
          on:change={() => { /* No immediate update */ }}
      />
  </label>

  <label>
      Cover Date End:
      <input 
          type="date" 
          bind:value={filters.coverDateEnd} 
          on:change={() => { /* No immediate update */ }}
      />
  </label>

  <button type="submit">Apply Filters</button>
  <button type="button" on:click={clearFilters}>Clear Filters</button>
</form>

{#if data.comics.length === 0}
<p>No comics in the collection.</p>
{:else}
<table>
  <thead>
    <tr>
      <th>
          <a href="#" on:click|preventDefault={() => sortComics('title')}>
              Title {sortColumn === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </a>
      </th>
      <th>
          <a href="#" on:click|preventDefault={() => sortComics('issue_number')}>
              Issue # {sortColumn === 'issue_number' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </a>
      </th>
      <th>
          <a href="#" on:click|preventDefault={() => sortComics('coverDate')}>
              Cover Date {sortColumn === 'coverDate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </a>
      </th>
      <th>
          <a href="#" on:click|preventDefault={() => sortComics('binLocation')}>
              Bin {sortColumn === 'binLocation' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </a>
      </th>
      <th>Quantity</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.comics as comic}
      <tr>
        <td>
            <img src={comic.imageUrlTiny} alt={comic.title} width="50" height="50">
            <a href={comic.siteUrl} target="_blank" rel="noopener noreferrer">{comic.title}</a>
        </td>
        <td>{comic.issue_number}</td>
        <td>{comic.coverDate}</td>
        <td>{comic.binLocation}</td>
        <td>{comic.quantityOwned}</td>
        <td>
          <span 
              class="trash-icon" 
              role="button" 
              tabindex="0" 
              aria-label="Delete Comic" 
              on:click={() => deleteComic(comic.id)} 
              on:keypress={(e) => { if (e.key === 'Enter' || e.key === ' ') deleteComic(comic.id); }}
          >&times;</span>
          <span 
              class="increment-icon" 
              role="button" 
              tabindex="0" 
              aria-label="Increment Quantity" 
              on:click={() => incrementQuantity(comic.id)} 
              on:keypress={(e) => { if (e.key === 'Enter' || e.key === ' ') incrementQuantity(comic.id); }}
          >+</span>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<style>
  /* Increment Icon Styles */
  .increment-icon {
      display: inline-block;
      cursor: pointer;
      padding: 2px 6px;
      background-color: #4caf50;
      color: white;
      border-radius: 50%;
      font-size: 14px;
      line-height: 1;
      margin-left: 5px;
  }
  
  .increment-icon:hover {
      background-color: #45a049;
  }

  /* Trash Icon Styles */
  .trash-icon {
      cursor: pointer;
      color: #f44336;
      font-size: 1.2rem;
  }

  .trash-icon:hover {
      color: #d32f2f;
  }

  /* Filter Section Styles */
  .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: flex-end;
  }

  .filters label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
      flex: 1 1 200px;
  }

  .filters input,
  .filters select {
      padding: 0.5rem;
      font-size: 1rem;
      margin-top: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
  }

  .filters button {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      cursor: pointer;
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      margin-top: 0.5rem;
  }

  .filters button[type="button"] {
      background-color: #f44336;
  }

  .filters button:hover {
      opacity: 0.9;
  }

  /* Table Styles */
  table {
      width: 100%;
      border-collapse: collapse;
  }

  th, td {
      padding: 0.75rem;
      border: 1px solid #ddd;
      text-align: left;
      vertical-align: middle;
  }

  th a {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
  }

  th a:hover {
      text-decoration: underline;
  }

  th a span {
      margin-left: 0.3rem;
      font-size: 0.8rem;
  }

  /* Responsive Image in Table */
  td img {
      vertical-align: middle;
      margin-right: 0.5rem;
      border-radius: 4px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
      .filters {
          flex-direction: column;
      }

      th, td {
          padding: 0.5rem;
      }

      .filters label {
          flex: 1 1 100%;
      }

      .filters button {
          align-self: stretch;
          margin-top: 1rem;
      }
  }
</style>
