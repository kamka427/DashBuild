<script lang="ts">
	interface Data {
		teams: {
			team: string;
		}[];
		tags: {
			tags: string[];
		}[];
	}

	export let data: Data;
	export let search: string;
	export let tag: string;
	export let team: string;

	export const teams = Array.from(new Set(data.teams.map((team) => team.team)));
	export const tags = Array.from(new Set(data.tags.map((tag) => tag.tags).flat()));
</script>

<input
	type="search"
	placeholder="Search for a dashboard"
	class="h-12 w-1/2 rounded-md bg-gray-200 px-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
	bind:value={search}
/>
<div class="flex gap-4">
	<div>
		<label for="tag" class="text-xl">Tags:</label>
		<select
			class="h-12 rounded-md bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
			id="tag"
			bind:value={tag}
		>
			<option value="none">None</option>
			{#each tags as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="team" class="text-xl">Teams:</label>
		<select
			class="h-12 rounded-md bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
			id="team"
			bind:value={team}
		>
			<option value="none">None</option>
			{#each teams as team}
				<option value={team}>{team}</option>
			{/each}
		</select>
	</div>
</div>
