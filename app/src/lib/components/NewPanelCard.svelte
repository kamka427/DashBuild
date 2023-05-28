<script lang="ts">
	// Import the panelEntry type
	import type { panelEntry } from '$lib/utils/types';

	// Define the component properties
	export let predefinedPanels: panelEntry[];
	export let addAction: (panel: panelEntry) => void;
	export let selectedPanel: panelEntry;

	// Set the selected panel
	const setSelection = (panel: panelEntry) => {
		selectedPanel = panel;
	};
</script>

<!-- Modal dialog for selecting a new panel -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
	<div class="container mx-auto rounded-md bg-base-200">
		<div class="flex items-center justify-between p-4">
			<h2 class="text-4xl">Select a new panel</h2>
			<label for="my-modal" class="btn-error btn">Close</label>
		</div>
		<!-- List of predefined panels -->
		<ul
			class="grid max-h-[40em] w-full grid-cols-2 gap-4 overflow-y-auto rounded-lg bg-base-100 p-4"
		>
			{#each predefinedPanels as panel}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- Label for selecting a panel -->
					<label
						for="my-modal"
						class="card card-compact bg-base-300"
						on:click={() => {
							setSelection(panel);
							addAction(panel);
						}}
					>
						<figure>
							<!-- Panel thumbnail image -->
							<img src={panel.thumbnailPath} alt="" class="h-full w-full rounded-md shadow-xl" />
						</figure>
						<div class="card-body">
							<!-- Panel title -->
							<p class="text-lg">{panel.title}</p>
						</div>
					</label>
				</li>
			{/each}
		</ul>
	</div>
</div>

<!-- Card for adding a new panel -->
<div class="card card-compact min-h-[30em] w-full bg-base-300 text-base-content shadow-xl">
	<figure class="flex h-full w-full items-center justify-center bg-base-200">
		<!-- Label for opening the modal dialog -->
		<label for="my-modal">
			<!-- Add panel icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-64 w-64 text-base-content"
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
		<!-- Card title -->
		<h2 class="card-title">Add a new panel</h2>
		<!-- Card description -->
		<p>Click here to add a new panel to your dashboard</p>
	</div>
</div>
