<!-- MenuHeader.svelte -->
<script>
    // Add any necessary imports or logic here
  </script>
  
  <header>
    <h1>Welcome to Mark's Comics</h1>
    <nav>
      <a href="/comiclist">Comic List</a>
      <a href="/searchid">Search by ID</a>
      <a href="/search">Search</a>
    </nav>
  </header>
  
  <style>
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f0f0f0;
    }
  
    h1 {
      margin: 0;
    }
  
    nav {
      display: flex;
      gap: 1rem;
    }
  
    a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }
  </style>