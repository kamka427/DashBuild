<script lang="ts">
	export let published: boolean;
	export let dashboardId: string;
</script>

<form action="?/publishDashboard" method="POST" class="stat flex flex-row">
	<input type="hidden" name="dashboardId" value={dashboardId} />
	<input type="hidden" name="publishState" value={published} />
	<div class="stat-title text-sm">Published</div>
	<button type="submit" class="stat-value text-sm underline">
		{#if published}
			True
		{:else}
			False
		{/if}
	</button>
</form>
