<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let isMenuOpen = false;
  </script>
  
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800 antialiased">
	<!-- Navbar -->
	<header class="bg-primary/200 bg-blue-800 backdrop-blur-md text-white sticky top-0 z-50 shadow-md transition-all duration-300">
	  <nav class="container mx-auto flex items-center justify-between p-4">
		<a href="/" class="text-2xl font-extrabold tracking-tight hover:text-secondary transition-colors">NSDC SUST</a>
		<!-- Desktop Menu -->
		<div class="hidden md:flex space-x-6 items-center">
		  <a href="/about" class="hover:text-secondary transition-colors duration-200">About Us</a>
		  <a href="/learn" class="hover:text-secondary transition-colors duration-200">Learn</a>
		  <a href="/events" class="hover:text-secondary transition-colors duration-200">Events</a>
		  <a href="/blog" class="hover:text-secondary transition-colors duration-200">Blog</a>
		  <a href="/community" class="hover:text-secondary transition-colors duration-200">Community</a>
		  <a href="/signin" class="bg-secondary px-4 py-2 rounded-full hover:bg-blue-400 transition-colors duration-200">Sign In</a>
		</div>
		<!-- Hamburger Button -->
		<button class="md:hidden focus:outline-none text-2xl" on:click={() => (isMenuOpen = !isMenuOpen) }>
			☰
		</button>
	  </nav>
	  <!-- Mobile Menu -->
	  {#if isMenuOpen}
		<div class="md:hidden bg-primary/95 p-4 space-y-3 shadow-lg animate-slide-in">
		  <a href="/about" class="block hover:text-secondary transition-colors">About Us</a>
		  <a href="/learn" class="block hover:text-secondary transition-colors">Learn</a>
		  <a href="/events" class="block hover:text-secondary transition-colors">Events</a>
		  <a href="/blog" class="block hover:text-secondary transition-colors">Blog</a>
		  <a href="/community" class="block hover:text-secondary transition-colors">Community</a>
		  <a href="/signin" class="block bg-secondary text-center py-2 rounded-full hover:bg-blue-400 transition-colors">Sign In</a>
		</div>
	  {/if}
	</header>
  
	<!-- Main Content -->
	<main class="flex-grow container mx-auto p-4 md:p-6 bg-gray-50">
	  <slot />
	</main>
  
	<!-- Footer -->
	<footer class="bg-primary/90 text-blue p-6 text-center shadow-inner">
	  <p class="mb-2">
		Contact: <a href="mailto:info@nsdcsust.com" class="underline hover:text-secondary">info@nsdcsust.com</a> | 
		Follow us on 
		<a href="https" class="underline hover:text-secondary">Facebook</a>, 
		<a href="http" class="underline hover:text-secondary">Twitter</a>
	  </p>
	  <p class="text-sm">© 2023 NSDC SUST. All rights reserved.</p>
	</footer>
  </div>
  
  <style>
	@keyframes slide-in {
	  from { transform: translateY(-20px); opacity: 0; }
	  to { transform: translateY(0); opacity: 1; }
	}
  </style>