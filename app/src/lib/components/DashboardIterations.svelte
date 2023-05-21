<script lang="ts">
	import type { DashboardIteration } from '@prisma/client';

	export let iterations: DashboardIteration[];

	iterations = iterations.sort((a, b) => b.version - a.version);
</script>

<div tabindex="-1" class="collapse-arrow rounded-box border-base-300 bg-base-100 collapse border">
	<div class="collapse-title text-xl font-medium">Click for Versions</div>
	<div class="collapse-content">
		<div class="flex flex-col gap-4">
			{#each iterations as iteration}
				<div class="card card-compact bg-base-300 text-base-content h-full w-full shadow-xl">
					<div class="card-body gap-4">
						<code class="card-title">Version: {iteration.version}</code>
						<div class="mockup-code overflow-x-scroll">
						
								<code class="whitespace-pre-wrap p-6">
									{JSON.stringify(iteration.grafanaJSON, null, '\t')}
								</code>
						</div>
						<code>Created at: {iteration.createdAt}</code>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
