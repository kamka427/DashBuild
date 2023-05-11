<script lang="ts">
	import type { panelEntry } from '$lib/utils/types';

	export let panels: panelEntry[];

	export let addAction: (panel: panelEntry) => void;

	export let selectedPanel: panelEntry;

	function setSelection(panel: panelEntry) {
		selectedPanel = panel;
	}
</script>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">   
	<div class="bg-base-200 container mx-auto rounded-md ">
		<div class="flex justify-between items-center p-4">
			<h2 class="text-4xl">Select a new panel</h2>
			<label for="my-modal" class="btn btn-error">Close</label>
		</div>
			<ul
					class="bg-base-100 grid max-h-[60em] w-full grid-cols-2 gap-4 overflow-y-auto rounded-lg p-4"
				>
					{#each panels as panel}
						<li>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<label
								for="my-modal"
								class="card card-compact bg-base-300"
								on:click={() => {
									setSelection(panel);
									addAction(panel);
								}}
							>
								<figure>
									<img
										src={panel.thumbnailPath}
										alt=""
										class="h-full w-full rounded-md shadow-xl"
									/>
								</figure>
								<div class="card-body">
									<p class="text-lg">{panel.title}</p>
								</div>
							</label>
						</li>
					{/each}
				</ul>
			</div>
</div>

<div class="card card-compact bg-base-300 text-base-content min-h-[30em] w-full shadow-xl">
	<figure class="bg-base-200 flex h-full w-full items-center justify-center">
		<label for="my-modal">
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
		</label>
	</figure>
	<div class="card-body">
		<h2 class="card-title">Add a new panel</h2>
		<p>Click here to add a new panel to your dashboard</p>
	</div>
</div>
