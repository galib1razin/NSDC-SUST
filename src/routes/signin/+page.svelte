<script lang="ts">
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let errorMessage = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    errorMessage = '';

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
        credentials: 'include', // Ensure cookies are sent/received
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error: ${res.status}`);
      }

      const data = await res.json();
      console.log('Login response:', data); // Debug output

      if (data.success) {
        console.log('Redirecting to:', data.redirect);
        goto(data.redirect);
      } else {
        errorMessage = data.message || 'Login failed';
      }
    } catch (err: unknown) {
  console.error('Login error:', err);

  // Narrowing the type of `err` to `Error`
  if (err instanceof Error) {
    errorMessage = err.message || 'An unexpected error occurred';
  } else {
    // Handle non-error types or unexpected errors
    errorMessage = 'An unexpected error occurred';
  }
}
 finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg my-12">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-900">Sign In</h1>
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div >Email</div>
    <input
      type="email"
      bind:value={email}
      placeholder="Email"
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      required
      disabled={loading}
    />
    <div>Password</div>
    <input
      type="password"
      bind:value={password}
      placeholder="Password"
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      required
      disabled={loading}
    />
    {#if errorMessage}
      <p class="text-red-500 text-sm">{errorMessage}</p>
    {/if}
    <button
      type="submit"
      class="w-full bg-black text-white py-3 rounded-lg hover:bg-blue-500 transition-all duration-300 font-semibold flex items-center justify-center"
      disabled={loading}
    >
      {#if loading}
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
        </svg>
        Signing In...
      {:else}
        Sign In
      {/if}
    </button>
  </form>
  <p class="mt-4 text-center text-gray-600">
    Not a member? <a href="/register" class="text-primary underline hover:text-blue-500">Join Us!</a>
  </p>
</div>