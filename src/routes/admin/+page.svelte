<script lang="ts">
  import { onMount } from 'svelte';
  import type { User, Blog } from '$lib/types';
  
  let pendingUsers: User[] = [];
  let pendingBlogs: Blog[] = [];
  let allUsers: User[] = [];
  let notification = { title: '', message: '', recipientIds: [] };
  let newUser = { name: '', email: '', password: '', role: 'MEMBER' };

  onMount(async () => {
    pendingUsers = await (await fetch('/api/admin/users/pending')).json();
    allUsers = await (await fetch('/api/admin/users')).json();
    pendingBlogs = await (await fetch('/api/admin/blogs/pending')).json();
  });

  async function approveUser(id: number) {
    await fetch('/api/admin/users/approve', { method: 'POST', body: JSON.stringify({ id }) });
    pendingUsers = pendingUsers.filter((u) => u.id !== id);
    allUsers = await (await fetch('/api/admin/users')).json();
  }

  async function approveBlog(id: number) {
    await fetch('/api/admin/blogs/approve', { method: 'POST', body: JSON.stringify({ id }) });
    pendingBlogs = pendingBlogs.filter((b) => b.id !== id);
  }

  async function addUser() {
    await fetch('/api/admin/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    newUser = { name: '', email: '', password: '', role: 'MEMBER' };
    allUsers = await (await fetch('/api/admin/users')).json();
  }

  async function sendNotification() {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    notification = { title: '', message: '', recipientIds: [] };
  }
</script>

<div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg my-12">
  <h1 class="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Pending Users</h2>
    {#each pendingUsers as user}
      <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
        <span>{user.name} ({user.email})</span>
        <button on:click={() => approveUser(user.id)} class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-all">Approve</button>
      </div>
    {/each}
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">All Users</h2>
    {#each allUsers as user}
      <div class="p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
        <span>{user.name} ({user.email}) - {user.role}</span>
      </div>
    {/each}
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Add User</h2>
    <form on:submit|preventDefault={addUser} class="space-y-4">
      <input
        bind:value={newUser.name}
        placeholder="Name"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        required
      />
      <input
        bind:value={newUser.email}
        type="email"
        placeholder="Email"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        required
      />
      <input
        bind:value={newUser.password}
        type="password"
        placeholder="Password"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        required
      />
      <select bind:value={newUser.role} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
        <option value="MEMBER">Member</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-500 transition-all font-semibold">
        Add User
      </button>
    </form>
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Pending Blogs</h2>
    {#each pendingBlogs as blog}
      <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
        <span>{blog.title}</span>
        <button on:click={() => approveBlog(blog.id)} class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-all">Approve</button>
      </div>
    {/each}
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Send Notification</h2>
    <form on:submit|preventDefault={sendNotification} class="space-y-4">
      <input
        bind:value={notification.title}
        placeholder="Title"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        required
      />
      <textarea
        bind:value={notification.message}
        placeholder="Message"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        required
      ></textarea>
      <select
        multiple
        bind:value={notification.recipientIds}
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
      >
        {#each allUsers as user}
          <option value={user.id}>{user.name} ({user.email})</option>
        {/each}
      </select>
      <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-500 transition-all font-semibold">
        Send
      </button>
    </form>
  </section>
</div>