<script lang="ts">
	export let dashboardName: string;
	export let rowCount: number;
	export let colCount: number;
</script>

<div class="flex flex-row gap-4">
	<label class="input-group">
		<span>Title</span>
		<input
			id="dashboardtitle"
			type="text"
			placeholder="Title of the dashboard"
			class="input-bordered input"
			bind:value={dashboardName}
		/>
	</label>
	<label class="input-group">
		<span>Rows</span>
		<input
			id="columns"
			type="number"
			placeholder="2"
			class="input-bordered input w-20"
			bind:value={rowCount}
			min="1"
			max="10"
		/>
	</label>
	<label class="input-group">
		<span>Columns</span>
		<input
			type="number"
			placeholder="2"
			class="input-bordered input w-20"
			bind:value={colCount}
			min="1"
			max="4"
		/>
	</label>
</div>
