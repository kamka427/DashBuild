<script lang="ts">
	export let published: boolean;
	export let dashboardId: string;
</script>

<div class="stat flex flex-row">
	<div class="stat-title text-sm">Published</div>
	<form
		method="POST"
		action="?/publishDashboard&dashboardId={dashboardId}&publishState={!published}"
		class="flex flex-row"
	>
		<button type="submit" class="stat-value text-sm underline">
			{#if published}
				True
			{:else}
				False
			{/if}
		</button>
	</form>
</div>
