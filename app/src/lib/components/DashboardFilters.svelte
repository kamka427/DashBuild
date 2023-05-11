<script lang="ts">
	export let tags: {
		tags: string[];
	}[];
	export let search: string;
	export let tag: string;
	export let columns: number;

	export const tagsArray = Array.from(new Set(tags.map((tag) => tag.tags).flat()));
</script>

<div class="flex">
	<div class="flex flex-row flex-wrap gap-4">
		<label class="input-group flex-1">
			<span>Search</span>
			<input
				type="search"
				placeholder="Search for a dashboard"
				class="input-bordered input"
				bind:value={search}
			/>
		</label>
		<label class="input-group flex-1">
			<span>Tag</span>
			<select class="select-bordered select" id="tag" bind:value={tag}>
				<option selected value="none">Filter by Tag</option>
				{#each tagsArray as tag}
					<option value={tag}>{tag === '' ? 'No tags provided' : tag}</option>
				{/each}
			</select>
		</label>
		<label class="input-group flex-1">
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
</div>
