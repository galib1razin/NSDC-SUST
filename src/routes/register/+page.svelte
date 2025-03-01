<script lang="ts">
    import { goto } from '$app/navigation';
  
    let isSustStudent: boolean | null = null;
    let formData = {
      name: '',
      email: '',
      regNo: '',
      session: '',
      dept: '',
      whatsapp: '',
      phone: '',
      facebook: '',
      linkedin: '',
      whyJoin: '',
      password: '',
    };
    let successMessage = '';
  
    async function handleRegister() {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action: 'register' }),
      });
      const data = await res.json();
      if (data.success) successMessage = data.message;
    }
  </script>
  
  <div class="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg my-12">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900">Register</h1>
    <p class="mb-4 text-gray-700 text-center">Are you a running student of SUST?</p>
    <div class="flex justify-center space-x-4 mb-6">
      <button
        on:click={() => (isSustStudent = true)}
        class="bg-primary bg-blue-800 text-white py-2 px-6 rounded-full hover:bg-blue-500 transition-all duration-300"
      >
        Yes
      </button>
      <button
        on:click={() => (isSustStudent = false)}
        class="bg-primary bg-blue-800 text-white py-2 px-6 rounded-full hover:bg-blue-500 transition-all duration-300"
      >
        No
      </button>
    </div>
  
    {#if isSustStudent === false}
      <p class="text-red-500 text-center">Sorry, you are not eligible to join NSDC SUST.</p>
    {:else if isSustStudent === true}
      <form on:submit|preventDefault={handleRegister} class="space-y-4">
        <input bind:value={formData.name} placeholder="Name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.email} type="email" placeholder="Email" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.regNo} placeholder="Registration No" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.session} placeholder="Session" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.dept} placeholder="Department" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.whatsapp} placeholder="WhatsApp No" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.phone} placeholder="Phone No" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
        <input bind:value={formData.facebook} placeholder="Facebook ID (optional)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
        <input bind:value={formData.linkedin} placeholder="LinkedIn ID (optional)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
        <textarea
          bind:value={formData.whyJoin}
          placeholder="Why do you want to join NSDC? (max 300 words)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          maxlength="300"
          required
        ></textarea>
        <input
          bind:value={formData.password}
          type="password"
          placeholder="Password"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-500 transition-all duration-300 font-semibold">
          Submit
        </button>
      </form>
      {#if successMessage}
        <p class="text-green-500 mt-4 text-center">{successMessage}</p>
      {/if}
    {/if}
  </div>