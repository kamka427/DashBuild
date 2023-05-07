<script lang="ts">
	export let dashboardName: string;
	export let colCount: number;
	export let tags: string[];
	export let teamName: string | null;
	export let published: boolean;
</script>

<div class="flex flex-row gap-4">
	<label class="input-group flex-1">
		<span>Title</span>
		<input
			type="text"
			placeholder="Title of the dashboard"
			class="input-bordered input"
			bind:value={dashboardName}
		/>
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
		<span>Team</span>
		<input
			type="text"
			placeholder="Team name (optional)"
			class="input-bordered input"
			bind:value={teamName}
		/>
	</label>
	<label class="input-group">
		<span>Published</span>
		<input
			type="checkbox"
			placeholder="Team name (optional)"
			class=" toggle toggle-lg h-full"
			bind:checked={published}
		/>
	</label>
</div>
