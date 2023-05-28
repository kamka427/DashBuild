<script>
	// Import the page store from SvelteKit and the themeConfig from the themeConfig.json file
	import { page } from '$app/stores';
	import { themeConfig } from '$lib/config/themeConfig.json';

	// Define the initials variable based on the user's name
	export const initials = $page.data.session?.user?.name
		?.split(' ')
		.map((/** @type {string[]} */ word) => word[0])
		.join('');
</script>

<!-- Select element for choosing a theme -->
<select class="select-bordered select" data-choose-theme>
	{#each themeConfig as theme}
		<!-- Option element for each theme in the themeConfig array -->
		<option value={theme.value}>{theme.key}</option>
	{/each}
</select>
