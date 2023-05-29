<script lang="ts">
	import {
		createSearchStore,
		panelSearchHandler,
	} from '$lib/stores/search';

	// Import the panelEntry type
	import type { panelEntry } from '$lib/utils/types';
	import { onDestroy } from 'svelte';

	// Define the component properties
	export let predefinedPanels: panelEntry[];
	export let addAction: (panel: panelEntry) => void;
	export let selectedPanel: panelEntry;

	console.log(predefinedPanels);

	// Create a search store for the panels
	const searchStore = createSearchStore(predefinedPanels);

	// Subscribe to changes in the search store
	const unsubscribe = searchStore.subscribe((model) => panelSearchHandler(model));

	// Unsubscribe from the search store when the component is destroyed
	onDestroy(() => {
		unsubscribe();
	});

	// Set the selected panel
	const setSelection = (panel: panelEntry) => {
		selectedPanel = panel;
	};
</script>

<!-- Modal dialog for selecting a new panel -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
	<div class="bg-base-200 container mx-auto rounded-md">
		<div class="flex items-center justify-between p-4">
			<h2 class="text-4xl">Select a new panel</h2>
			<div class="flex gap-4">
				<label class="input-group">
					<span>Search</span>
					<input
						type="search"
						placeholder="Search for a dashboard"
						class="input-bordered input"
						bind:value={$searchStore.search}
					/>
				</label>
				<label for="my-modal" class="btn-error btn">Close</label>
			</div>
		</div>
		<!-- List of predefined panels -->
		<ul
			class="bg-base-100 grid max-h-[40em] w-full grid-cols-2 gap-4 overflow-y-auto rounded-lg p-4"
		>
			{#each $searchStore.filtered as panel}
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
							<img
								src={panel.thumbnailPath + '?time=' + Date.now()}
								alt="Panel thumbnail"
								class="h-full w-full rounded-md shadow-xl"
							/>
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
<div class="card card-compact bg-base-300 text-base-content min-h-[30em] w-full shadow-xl">
	<figure class="bg-base-200 flex h-full w-full items-center justify-center">
		<!-- Label for opening the modal dialog -->
		<label for="my-modal">
			<!-- Add panel icon -->
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
		<!-- Card title -->
		<h2 class="card-title">Add a new panel</h2>
		<!-- Card description -->
		<p>Click here to add a new panel to your dashboard</p>
	</div>
</div>
