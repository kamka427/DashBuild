<script lang="ts">
	interface Data {
		tags: {
			tags: string[];
		}[];
	}

	export let data: Data;
	export let search: string;
	export let tag: string;
	export let columns: number;

	export const tags = Array.from(new Set(data.tags.map((tag) => tag.tags).flat()));
</script>

<div class="flex flex-row gap-4">
	<label class="input-group">
		<span>Search</span>
		<input
			type="search"
			placeholder="Search for a dashboard"
			class="input-bordered input"
			bind:value={search}
		/>
	</label>
	<label class="input-group">
		<span>Tag</span>
		<select class="select-bordered select" id="tag" bind:value={tag}>
			<option selected value="none">Filter by Tag</option>
			{#each tags as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
	</label>
	<label class="input-group">
		<span>Columns</span>
		<input
			class="input-bordered input"
			id="columns"
			bind:value={columns}
			min="1"
			max="4"
			type="number"
			placeholder="2"
		/>
	</label>
</div>
