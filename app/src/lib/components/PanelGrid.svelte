<script lang="ts">
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import type { Panel } from '@prisma/client';

	export let panels: Panel[];

	panels = panels.sort((a, b) => a.position - b.position);
</script>

<div tabindex="-1" class="collapse-arrow rounded-box collapse border border-base-300 bg-base-100">
	<div class="collapse-title text-xl font-medium">Click for Panels</div>
	<div class="collapse-content">
		<div class="flex gap-4">
			<div class="grid grid-cols-4 gap-4">
				{#each panels as panel}
					<PanelPreviewCard {panel} />
				{/each}
			</div>
		</div>
	</div>
</div>
