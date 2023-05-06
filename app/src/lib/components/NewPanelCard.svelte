<script lang="ts">
	import type { Panel } from '@prisma/client';

	export let panels: Panel[];
	export let state: 'selected' | 'unselected' = 'unselected';

	function toggleState() {
		if (state === 'unselected') {
			state = 'selected';
		} else {
			state = 'unselected';
		}
	}

	export let addAction: Function;

	export let selectedPanel: {};

	function setSelection(panel: {}) {
		selectedPanel = panel;
	}
</script>

<div class="card-compact card bg-base-300 text-base-content w-full">
	{#if state === 'unselected'}
		<figure class="bg-base-200 flex h-full w-full items-center justify-center">
			<button on:click={toggleState}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-base-content h-64 w-64"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					filter="drop-shadow(4px 4px 2px rgb(0 0 0 / 0.2))"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</button>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Add a new panel</h2>
			<p>Click here to add a new panel to your dashboard</p>
		</div>
	{/if}
	{#if state === 'selected'}
		<div class="card-body">
			<h2 class="card-title">Select the new panel</h2>
			<ul class="menu bg-base-100 rounded-md">
				{#each panels as panel}
					<li>
						<button
							on:click={() => {
								setSelection(panel);
								addAction(panel);
								toggleState();
							}}
							class="btn-ghost btn rounded-md"
						>
							<img class="h-8" src={panel.thumbnailPath} alt="" />
							{panel.title}
						</button>
					</li>
				{/each}
				<li>
					<button class="btn-secondary btn rounded-md" on:click={toggleState}>Discard</button>
				</li>
			</ul>
		</div>
	{/if}
</div>
