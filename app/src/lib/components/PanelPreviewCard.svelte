<script lang="ts">
	import { panelFields } from '$lib/configs/panelTemplates.json';

	interface Panel {
		id: string;
		name: string;
		description: string;
		preview: string;
		representation: string;
	}

	export let panel: Panel | null;


	const shortDescription = panel?.description
		? panel.description.length > 150
			? panel.description.substring(0, 150) + '...'
			: panel.description
		: 'No description provided';



</script>

<div class="card-compact card bg-base-300 text-base-content w-full">
	<figure>
		<img src="../{panel?.preview}" class="w-max rounded-md shadow-xl" alt="Dashboard thumbnail" />
	</figure>
		<div class="card-body gap-4">
			<h2 class="card-title">{panel?.name}</h2>
			<p>{shortDescription}</p>
			<div class="card-actions justify-end">
			</div>
		</div>
</div>
