<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { User, Notification } from '$lib/types';
  
    let user: User | null = null;
    let notifications: Notification[] = [];
    let intervalId: ReturnType<typeof setInterval> | undefined; // Correct type for setInterval
  
    async function fetchNotifications() {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      const newNotifications: Notification[] = await res.json();
      if (notifications.length < newNotifications.length && Notification.permission === 'granted') {
        new Notification(newNotifications[0].title, { body: newNotifications[0].message });
      }
      notifications = newNotifications;
    }
  
    onMount(async () => {
      const res = await fetch('/api/user', { credentials: 'include' });
      user = await res.json();
      await fetchNotifications();
      if (Notification.permission !== 'granted') Notification.requestPermission();
      intervalId = setInterval(fetchNotifications, 60000); // Check every minute
    });
  
    onDestroy(() => {
      if (intervalId !== undefined) clearInterval(intervalId);
    });
  </script>
  
  {#if user}
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-12">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Welcome, {user.name}</h1>
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Notifications</h2>
    {#each notifications as notif}
      <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition-colors">
        <p class="font-semibold text-gray-900">{notif.title}</p>
        <p class="text-gray-700">{notif.message}</p>
        <p class="text-sm text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
      </div>
    {/each}
  </div>
{/if}