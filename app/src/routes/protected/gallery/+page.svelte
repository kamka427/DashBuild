<script>
	import FilterComponent from '../../../components/FilterComponent.svelte';

	import Pagination from '../../../components/Pagination.svelte';
	import GalleryDashboard from '../../../components/GalleryDashboard.svelte';

	let tags = ['val1', 'val2', 'val3', 'val4'];
	export let dashboards = [
		'../../src/placeholders/dash5.png',
		'../../src/placeholders/dash6.png',
		'../../src/placeholders/dash2.png',
		'../../src/placeholders/dash4.png'
	];
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">Gallery</h1>
				<FilterComponent />
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3">
				{#each dashboards as dashboard}
					<GalleryDashboard source={dashboard} />
				{/each}
			</div>
			<Pagination />
		</div>
	</div>
</main>
