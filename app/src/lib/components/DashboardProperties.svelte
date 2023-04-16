<script lang="ts">
	export let dashboardName: string;
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
