<script lang="ts">
	// Import the enhance function from the forms module
	import { enhance } from '$app/forms';

	// Define the props passed to the component
	export let published: boolean;
	export let dashboardId: string;
</script>

<!-- Form for publishing or unpublishing a dashboard -->
<form method="POST" action="?/publishDashboard" class="flex flex-row" use:enhance>
	<!-- Hidden input for the dashboard ID -->
	<input type="hidden" name="dashboardId" id="dashboardId" value={dashboardId} />
	<!-- Hidden input for the publish state -->
	<input type="hidden" name="publishState" id="publishState" value={!published} />
	<!-- Button for publishing or unpublishing the dashboard -->
	<button type="submit" class="btn {published ? 'btn-error' : 'btn-success'}">
		{#if published}
			Unpublish
		{:else}
			Publish
		{/if}
	</button>
</form>
