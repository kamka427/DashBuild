<script>
	import { page } from '$app/stores';
	import { themeConfig } from '$lib/config/themeConfig.json';
	export const initials = $page.data.session?.user?.name
		?.split(' ')
		.map((/** @type {string[]} */ word) => word[0])
		.join('');
</script>

<select class="select select-bordered" data-choose-theme>
	{#each themeConfig as theme}
		<option value={theme.value}>{theme.key}</option>
	{/each}
</select>
