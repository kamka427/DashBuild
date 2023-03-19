<script lang="ts">
	import Add from '$lib/svgs/Add.svelte';

	interface Panel {
		id: string;
		name: string;
		description: string;
		preview: string;
		representation: string;
	}

	export let panel: Panel;

	const shortDescription = panel.description
		? panel.description.length > 150
			? panel.description.substring(0, 150) + '...'
			: panel.description
		: 'No description provided';

	type componentState = 'preview' | 'edit';
	export let state = 'preview' as componentState;

	let props = ['Center', 'Radius', 'Color'];
</script>

<div class="card-compact card bg-base-300 text-base-content">
	<figure>
		<img src={panel.preview} class="w-max rounded-md shadow-xl" alt="Dashboard thumbnail" />
	</figure>
	{#if state === 'preview' || state === 'edit'}
		<div class="card-body gap-4">
			<h2 class="card-title">{panel.name}</h2>
			<p class="h-6">{shortDescription}</p>
			{#if state === 'edit'}
				<div class="divider" />
				<div class="flex w-1/2 flex-col gap-3">
					<h2 class="text-xl">Properties</h2>
					{#each props as prop}
						<label class="input-group">
							<span class="bg-accent text-accent-content w-24">{prop}</span>
							<input type="text" placeholder="..." class="input input-bordered w-full" />
						</label>
					{/each}
				</div>
			{/if}
			<div class="card-actions justify-end">
				<div class="btn-group">
					<button class="btn-secondary btn">Remove</button>
					<button
						class="btn-primary btn"
						on:click={() => {
							state = state === 'preview' ? 'edit' : 'preview';
						}}>{state === 'preview' ? 'Customize' : 'Save'}</button
					>
				</div>
			</div>
		</div>
	{/if}
</div>
