<script lang="ts">
	import { enabledPanelFields } from '$lib/configs/enabledPanelFields.json';

	interface Panel {
		id: string;
		name: string;
		description: string;
		preview: string;
		representation: {
			[key: string]: any;
		};
	}

	interface PanelFields {
		[key: string]: {
			[key: string]: string[];
		};
	}

	export let panel: Panel;

	export let hideButtons: boolean | null = false;

	type componentState = 'preview' | 'edit';
	export let state = 'preview' as componentState;

	function getPanelType(panel: Panel) {
		return panel.representation.type;
	}

	let type = getPanelType(panel) || 'graph';

	const props = enabledPanelFields[type] ? Object.keys(enabledPanelFields[type]) : [];

	export let removeAction: any;
</script>

<div class="card-compact card bg-base-300 text-base-content w-full">
	<figure>
		<img src="../{panel?.preview}" class="w-max rounded-md shadow-xl" alt="Dashboard thumbnail" />
	</figure>
	{#if state === 'preview' || state === 'edit'}
		<div class="card-body gap-4">
			<input
				bind:value={panel.name}
				class="card-title input"
				type="text"
				placeholder="Panel title"
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
							<select class="select select-bordered">
								{#each enabledPanelFields[type][prop] as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						</label>
					{/each}
				</div>
			{/if}
			<div class="card-actions justify-end">
				{#if !hideButtons}
					<div class="btn-group">
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
				{/if}
			</div>
		</div>
	{/if}
</div>
