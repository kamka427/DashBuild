<script lang="ts">
	export let tags: string[];
	export let teams: string[];
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
		{#each teams as team}
			<option value={team}>{team}</option>
		{/each}
	</select>
</div>
