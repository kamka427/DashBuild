<script lang="ts">
	import { enhance } from '$app/forms';

	export let published: boolean;
	export let dashboardId: string;
</script>

<form method="POST" action="?/publishDashboard" class="flex flex-row" use:enhance>
	<input type="hidden" name="dashboardId" id="dashboardId" value={dashboardId} />
	<input type="hidden" name="publishState" id="publishState" value={!published} />
	<button type="submit" class="btn {published ? 'btn-error' : 'btn-success'}">
		{#if published}
			Unpublish
		{:else}
			Publish
		{/if}
	</button>
</form>
