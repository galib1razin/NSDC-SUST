<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="text-center py-12 bg-gray-50 rounded-xl">
  <h1 class="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 animate-fade-in">Welcome to NSDC SUST</h1>
  <img src="/banner.jpg" alt="Club Banner" class="w-full max-w-3xl mx-auto h-64 md:h-96 object-cover rounded-xl shadow-lg mb-6" />
  <p class="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
    Join us to explore, learn, and grow with the NSDC SUST community.
  </p>
  <button
    on:click={() => goto('/signin')}
    class="bg-secondary bg-blue-800 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-400 transition-all duration-300 shadow-md"
  >
    Join Us Today
  </button>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 1s ease-in-out;
  }
</style>