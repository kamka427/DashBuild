<script lang="ts">
	// Import the Panel type from the Prisma client
	import type { Panel } from '@prisma/client';

	// Define the props passed to the component
	export let panel: Panel;

	export let state: 'preview' | 'edit' = 'preview';

	export let removeAction: any;

	export let dragEvent: (event: any) => void;
	export let dropEvent: (event: any) => void;

	export let colCount: number;
	export let isDropTarget = false;
	export let isDragged = false;
	export let dragOn: boolean;

	// Convert the panel position to a string
	const positionId = String(panel.position);

	// Arrow function to update a nested property in the panel object
	const deepUpdate = (path: string, value: any) => {
		const pathArray = path.split('.');
		let currentObject = panel.grafanaJSON as any;

		for (let i = 0; i < pathArray.length; i++) {
			if (i === pathArray.length - 1) {
				console.log('hit');
				currentObject[pathArray[i]] = value;
			} else {
				console.log('hit2');
				currentObject = currentObject[pathArray[i]];
			}
		}

		console.log(currentObject);
		const grafanaJSON = panel.grafanaJSON as object;
		panel = {
			...panel,
			grafanaJSON: {
				...grafanaJSON
			}
		};

		console.log(grafanaJSON);
	};

	// Arrow function to update a nested property in the panel object based on an event
	const deepUpdateEvent = (path: string, event: any) => {
		deepUpdate(path, event.target.value);
	};

	// Get the list of properties for the panel
	const propertyList = panel.properties as any[];
	console.log(propertyList);
</script>

<div
	class="col-span-{panel?.width}"
	on:dragstart={(e) => {
		dragEvent(e);
		isDragged = true;
		dragOn = true;
	}}
	on:dragend={() => {
		isDragged = false;
		dragOn = false;
	}}
	on:dragover={(e) => {
		e.preventDefault();
		isDropTarget = true;
	}}
	on:dragenter={(e) => {
		e.preventDefault();
		isDropTarget = true;
	}}
	on:dragleave={(e) => {
		e.preventDefault();
		isDropTarget = false;
	}}
	on:drop={(e) => {
		e.preventDefault();
		isDropTarget = false;
		dropEvent(e);
		dragOn = false;
	}}
	on:dragexit={(e) => {
		e.preventDefault();
		isDropTarget = false;
		dragOn = false;
	}}
	on:mouseleave={(e) => {
		e.preventDefault();
		isDropTarget = false;
		dragOn = false;
	}}
>
	{#if isDropTarget === true && dragOn == true}
		<div
			id={positionId}
			class="card card-compact h-full min-h-[35em] bg-base-300 text-base-content shadow-xl"
		>
			<div class="card-body" id={positionId}>
				<p id={positionId} class="text-2xl">Drop here to swap Panels</p>
			</div>
		</div>
	{:else}
		<div
			draggable="true"
			id={positionId}
			class="card card-compact bg-base-300 text-base-content shadow-xl"
		>
			<figure>
				<img
					src={panel?.thumbnailPath + '?time=' + Date.now()}
					class="rounded-md shadow-xl"
					alt="Panel thumbnail"
					id={positionId}
				/>
			</figure>
			{#if state === 'preview' || state === 'edit'}
				<div id={positionId} class="card-body gap-4">
					<input
						bind:value={panel.name}
						class="input card-title"
						type="text"
						placeholder="Panel title"
						on:input={() => {
							deepUpdate('title', panel.name);
						}}
					/>
					<input
						bind:value={panel.description}
						class="input"
						type="text"
						placeholder="Panel description"
					/>
					{#if state === 'edit'}
						<div class="divider" />
						<h2 class="text-xl">Properties</h2>
						<div class="flex flex-col gap-3">
							{#if propertyList === undefined}
								<p class="text-lg">No properties available</p>
							{:else}
								<table class="table w-full">
									<thead>
										<tr>
											<th>Key</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										{#each propertyList as prop}
											<tr>
												<td>{prop.key}</td>
												<td
													><select
														class="select-bordered select w-full"
														bind:value={prop.selected}
														on:change={(e) => {
															deepUpdateEvent(prop.path, e);
														}}
													>
														{#each prop.values as option}
															<option value={option}>{option}</option>
														{/each}
													</select></td
												>
											</tr>
										{/each}
									</tbody>
								</table>
							{/if}
						</div>
					{/if}
					<div class="card-actions flex flex-wrap justify-between gap-2">
						<label class="input-group flex-1">
							<span class="bg-base-content text-white">Width</span>
							<input
								type="number"
								class="input-bordered input"
								bind:value={panel.width}
								min="1"
								max={colCount}
							/>
						</label>
						<div class="btn-group flex flex-wrap">
							<button
								on:click={() => {
									removeAction(panel?.id);
								}}
								class="btn-secondary btn">Remove Panel</button
							>
							<button
								class="btn-primary btn"
								on:click={() => {
									state = state === 'preview' ? 'edit' : 'preview';
								}}
								>{state === 'preview' && propertyList !== null
									? 'Show Properties'
									: 'Hide Properties'}</button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
