<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	onMount(() => {
		themeChange(false);
	});
</script>

<Navigation />
<main class="p-6">
	<slot />
</main>
