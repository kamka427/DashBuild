<script>
	// Import the global styles and the Navigation component
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';

	// Import the onMount function and the themeChange function
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// Call the themeChange function with the parameter false when the component is mounted
	onMount(() => {
		themeChange(false);
	});
</script>

<!-- Display the Navigation component and the main content -->
<Navigation />
<main class="p-6">
	<slot />
</main>
