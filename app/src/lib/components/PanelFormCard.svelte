<script lang="ts">
	import type { Panel } from '@prisma/client';

	export let panel: Panel;

	export let state: 'preview' | 'edit' = 'preview';

	function getPanelType(panel: Panel) {
		return panel?.grafanaJSON?.type;
	}

	const type = getPanelType(panel as Panel) as string;

	export let removeAction: any;

	export let dragEvent: any;
	export let dropEvent: any;

	export let colCount: number;
	export let isDropTarget = false;
	export let isDragged = false;
	export let dragOn: boolean;
</script>

<div
	class="col-span-{panel?.width}"
	on:dragstart={(e) => {
		dragEvent(e);
		isDragged = true;
		dragOn = true;
	}}
	on:dragend={(e) => {
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
			id={panel.position}
			class="card card-compact h-full min-h-[35em] bg-base-300 text-base-content shadow-xl"
		>
			<div class="card-body" id={panel.position}>
				<p id={panel.position} class="text-2xl">Drop here to swap Panels</p>
			</div>
		</div>
	{:else}
		<div
			draggable="true"
			id={panel.position}
			class="card card-compact h-full bg-base-300 text-base-content shadow-xl"
		>
			<figure>
				<img
					src={panel?.thumbnailPath}
					class="rounded-md shadow-xl"
					alt="Dashboard thumbnail"
					id={panel.position}
				/>
			</figure>
			{#if state === 'preview' || state === 'edit'}
				<div id={panel.position} class="card-body gap-4">
					<input
						bind:value={panel.name}
						class="input card-title"
						type="text"
						placeholder="Panel title"
						on:input={() => {
							updateJSON('title', panel.name);
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
							{#each props as prop}
								<label class="input-group">
									<span class="bg-accent text-accent-content">{prop}</span>
									<select class="select-bordered select">
										<!-- {#each enabledPanelFields[type][prop] as option}
											<option
												value={option}
												on:input={() => {
													updateJSON(prop, option);
												}}>{option}</option
											>
										{/each} -->
									</select>
								</label>
							{/each}
						</div>
					{/if}
					<div
						class="card-actions flex
			justify-end"
					>
						<div class="btn-group">
							<label class="input-group">
								<span class="bg-info text-white">Width</span>
								<input
									type="number"
									class="input-bordered input"
									bind:value={panel.width}
									min="1"
									max={colCount}
								/>
							</label>
							<button
								on:click={() => {
									removeAction(panel?.id);
								}}
								class="btn-secondary btn">Remove</button
							>
							<button
								class="btn-primary btn"
								on:click={() => {
									state = state === 'preview' ? 'edit' : 'preview';
								}}>{state === 'preview' ? 'Customize' : 'Minimize'}</button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
