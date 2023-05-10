<script lang="ts">
	export let title: string;
	export let description: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
</script>

<div class="flex">
	<div class="flex flex-row flex-wrap gap-4">
		<label class="input-group flex-1">
			<span>Title</span>
			<input
				type="text"
				placeholder="Title of the dashboard"
				class="input-bordered input"
				bind:value={title}
			/>
		</label>
		<label class="input-group flex-1">
			<span>Description</span>
			<input
				type="text"
				placeholder="Description of the dashboard"
				class="input-bordered input"
				bind:value={description}
			/>
		</label>
		<label class="input-group flex-1">
			<span>Tags</span>
			<input
				type="text"
				placeholder="Tags separated by comma"
				class="input-bordered input"
				bind:value={tags}
			/>
		</label>
		<label class="input-group flex-1">
			<span>Published</span>
			<input type="checkbox" class=" toggle toggle-lg h-full" bind:checked={published} />
		</label>
		<label class="input-group flex-1">
			<span>Columns</span>
			<input
				type="number"
				placeholder="2"
				class="input-bordered input"
				bind:value={colCount}
				min="1"
				max="4"
			/>
		</label>
	</div>
</div>
