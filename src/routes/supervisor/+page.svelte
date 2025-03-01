<script lang="ts">
    import { onMount } from 'svelte';
  
    // Define interfaces based on Prisma schema
    interface User {
      id: number;
      name: string;
      email: string;
      role?: 'MEMBER' | 'ADMIN' | 'SUPERVISOR'; // Optional since not always fetched
    }
  
    interface Blog {
      id: number;
      title: string;
      content?: string; // Optional since we only need title for pending list
    }
  
    interface Admin extends User {
      role: 'ADMIN' | 'SUPERVISOR'; // Admins list includes only these roles
    }
  
    // Explicitly type the variables
    let pendingUsers: User[] = [];
    let pendingBlogs: Blog[] = [];
    let admins: Admin[] = [];
    let notification = { title: '', message: '', recipientIds: [] as number[] };
    let allUsers: User[] = [];
  
    onMount(async () => {
      pendingUsers = await (await fetch('/api/admin/users/pending')).json();
      pendingBlogs = await (await fetch('/api/admin/blogs/pending')).json();
      admins = await (await fetch('/api/supervisor/admins')).json();
      allUsers = await (await fetch('/api/admin/users')).json();
    });
  
    async function approveUser(id: number) {
      await fetch('/api/admin/users/approve', { method: 'POST', body: JSON.stringify({ id }) });
      pendingUsers = pendingUsers.filter((u) => u.id !== id);
    }
  
    async function approveBlog(id: number) {
      await fetch('/api/admin/blogs/approve', { method: 'POST', body: JSON.stringify({ id }) });
      pendingBlogs = pendingBlogs.filter((b) => b.id !== id);
    }
  
    async function promoteAdmin(id: number) {
      await fetch('/api/supervisor/admins/promote', { method: 'POST', body: JSON.stringify({ id }) });
      admins = admins.map((a) => (a.id === id ? { ...a, role: 'SUPERVISOR' } : a));
    }
  
    async function demoteAdmin(id: number) {
      await fetch('/api/supervisor/admins/demote', { method: 'POST', body: JSON.stringify({ id }) });
      admins = admins.map((a) => (a.id === id ? { ...a, role: 'ADMIN' } : a));
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
  <h1 class="text-3xl font-bold mb-6 text-gray-900">Supervisor Dashboard</h1>

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
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Pending Blogs</h2>
    {#each pendingBlogs as blog}
      <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
        <span>{blog.title}</span>
        <button on:click={() => approveBlog(blog.id)} class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-all">Approve</button>
      </div>
    {/each}
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Admins</h2>
    {#each admins as admin}
      <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
        <span>{admin.name} ({admin.email}) - {admin.role}</span>
        <div class="space-x-2">
          {#if admin.role === 'ADMIN'}
            <button on:click={() => promoteAdmin(admin.id)} class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all">Promote</button>
          {:else if admin.role === 'SUPERVISOR'}
            <button on:click={() => demoteAdmin(admin.id)} class="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all">Demote</button>
          {/if}
        </div>
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