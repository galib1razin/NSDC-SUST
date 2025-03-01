<script lang="ts">
  import { onMount } from 'svelte';
  import type { Blog } from '$lib/types';

  let blogs: Blog[] = [];
  let searchQuery = '';
  let filterAuthor = '';
  let filterDate = '';

  onMount(async () => {
    const res = await fetch('/api/blog');
    blogs = await res.json();
  });

  $: filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterAuthor ? blog.author.name === filterAuthor : true) &&
      (filterDate ? new Date(blog.createdAt).toLocaleDateString() === filterDate : true)
  );
</script>

<div class="max-w-5xl mx-auto">
  <h1 class="text-3xl font-bold mb-6 text-gray-900">Blog</h1>
  <div class="mb-6 space-y-4">
    <input
      bind:value={searchQuery}
      placeholder="Search by title..."
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
    />
    <div class="flex space-x-4">
      <select bind:value={filterAuthor} class="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
        <option value="">All Authors</option>
        {#each [...new Set(blogs.map((b) => b.author.name))] as author}
          <option value={author}>{author}</option>
        {/each}
      </select>
      <input
        bind:value={filterDate}
        type="date"
        class="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
      />
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredBlogs as blog}
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <img src={blog.image} alt={blog.title} class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
          <p class="text-gray-600 mb-3">{blog.content.slice(0, 100)}...</p>
          <p class="text-sm text-gray-500">By {blog.author.name} on {new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    {/each}
  </div>
</div>