<script lang="ts">
	import { enhance } from '$app/forms';

	export let published: boolean;
	export let dashboardId: string;
</script>

<div class="stat flex flex-row">
	<div class="stat-title text-sm">Published</div>
	<form
		method="POST"
		action="?/publishDashboard"
		class="flex flex-row"
		use:enhance
	>
		<input type="hidden" name="dashboardId" id="dashboardId" value={dashboardId} />
		<input type="hidden" name="publishState" id="publishState" value={!published} />
		<button type="submit" class="stat-value text-sm underline">
			{#if published}
				True
			{:else}
				False
			{/if}
		</button>
	</form>
</div>
