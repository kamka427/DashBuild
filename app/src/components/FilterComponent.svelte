<script lang="ts">
	import type { T } from 'vitest/dist/types-7cd96283';

	let tags = ['val1', 'val2', 'val3', 'val4'];

	export let value: string;
</script>

<input
	type="search"
	placeholder="Search for a dashboard"
	class="h-12 w-1/2 rounded-md bg-gray-200 px-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
	bind:value
/>
<div class="flex gap-4">
	<select
		class="h-12 rounded-md bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
	>
		<option value="none">Tags</option>
		{#each tags as tag}
			<option value={tag}>{tag}</option>
		{/each}
	</select>
	<select
		class="h-12 rounded-md bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
	>
		<option value="none">Teams</option>
		{#each tags as tag}
			<option value={tag}>{tag}</option>
		{/each}
	</select>
</div>
