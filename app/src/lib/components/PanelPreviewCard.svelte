<script lang="ts">
	// Import the Panel type from the Prisma client
	import type { Panel } from '@prisma/client';

	// Define the props passed to the component
	export let panel: Panel | null;

	// Shorten the panel description if it is too long
	const shortDescription = panel?.description
		? panel.description.length > 150
			? panel.description.substring(0, 150) + '...'
			: panel.description
		: 'No description provided';
</script>

<!-- Card for displaying a panel preview -->
<div class="card card-compact w-full bg-base-300 text-base-content">
	<figure>
		<!-- Panel thumbnail image -->
		<img src={panel?.thumbnailPath} class="w-max rounded-md shadow-xl" alt="Dashboard thumbnail" />
	</figure>
	<div class="card-body gap-4">
		<!-- Panel title -->
		<h2 class="card-title">{panel?.name}</h2>
		<!-- Shortened panel description -->
		<p>{shortDescription}</p>
		<div class="card-actions justify-end" />
	</div>
</div>
