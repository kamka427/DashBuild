<script lang="ts">
	import type { DashboardIteration } from '@prisma/client';

	export let iterations: DashboardIteration[];

	iterations = iterations.sort((a, b) => b.version - a.version);
</script>

<div tabindex="-1" class="collapse-arrow rounded-box collapse border border-base-300 bg-base-100">
	<div class="collapse-title text-xl font-medium">Click for Versions</div>
	<div class="collapse-content">
		<div class="flex flex-col gap-4">
			{#each iterations as iteration}
				<div class="card card-compact h-full w-full bg-base-300 text-base-content shadow-xl">
					<div class="card-body gap-4">
						<code class="card-title">Version: {iteration.version}</code>
						<div class="mockup-code overflow-x-scroll">
							<p class="p-6">
								<code>
									{JSON.stringify(iteration.grafanaJSON)}
								</code>
							</p>
						</div>
						<code>Created at: {iteration.createdAt}</code>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
