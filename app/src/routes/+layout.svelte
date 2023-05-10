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
	<p class="text-center text-base-content">Neszlényi Kálmán Balázs (DPU51T) 2023. ELTE-IK</p>
</main>
