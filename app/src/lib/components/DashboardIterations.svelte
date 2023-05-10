<script lang="ts">
	import type { DashboardIteration } from '@prisma/client';

	export let iterations: DashboardIteration[];
</script>

<div tabindex="-1" class="collapse-arrow border-base-300 bg-base-100 rounded-box collapse border">
	<div class="collapse-title text-xl font-medium">Click for Versions</div>
	<div class="collapse-content">
		<div class="flex flex-col gap-4">
			{#each iterations as iteration}
				<div class="card-compact card bg-base-300 text-base-content h-full w-full shadow-xl">
					<div class="card-body gap-4">
						<code class="card-title">Version: {iteration.version}</code>
						<code class="overflow-x-scroll">
							{JSON.stringify(iteration.grafanaJSON)}
						</code>
						<code>Created at: {iteration.createdAt}</code>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
