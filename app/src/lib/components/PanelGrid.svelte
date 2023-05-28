<script lang="ts">
	// Import the PanelPreviewCard component and the Panel type from the Prisma client
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import type { Panel } from '@prisma/client';

	// Define the props passed to the component
	export let panels: Panel[];

	// Sort the panels by position
	panels = panels.sort((a, b) => a.position - b.position);
</script>

<div tabindex="-1" class="collapse-arrow rounded-box collapse border border-base-300 bg-base-100">
	<div class="collapse-title text-xl font-medium">Click for Panels</div>
	<div class="collapse-content">
		<div class="flex gap-4">
			<div class="grid grid-cols-4 gap-4">
				{#each panels as panel}
					<!-- Render a PanelPreviewCard component for each panel -->
					<PanelPreviewCard {panel} />
				{/each}
			</div>
		</div>
	</div>
</div>
