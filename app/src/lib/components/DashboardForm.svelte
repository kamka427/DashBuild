<script lang="ts">
	// Import the enhance function from SvelteKit and the Panel type from Prisma
	import { enhance } from '$app/forms';
	import type { Panel } from '@prisma/client';

	// Define the props passed to the component
	export let title: string;
	export let description: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
	export let panelForm: Panel[];
	export let isLoading: boolean;
</script>

<form class="self-center" action="?/saveDashboard" method="POST" use:enhance>
	<!-- Hidden input fields for the dashboard form data -->
	<input type="hidden" value={title} name="title" />
	<input type="hidden" value={description} name="description" />
	<input type="hidden" value={colCount} name="colCount" />
	<input type="hidden" value={tags} name="tags" />
	<input type="hidden" value={published} name="published" />
	<input type="hidden" value={JSON.stringify(panelForm)} name="panelForm" />

	<!-- Save dashboard button -->
	<div class="btn-group">
		<button
			type="submit"
			class="btn-primary btn"
			on:click={() => {
				isLoading = true;
			}}
		>
			Save Dashboard
		</button>
	</div>
</form>
