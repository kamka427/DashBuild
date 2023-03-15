<script lang="ts">
	import FilterComponent from '../../../components/FilterComponent.svelte';
	import Pagination from '../../../components/Pagination.svelte';
	import GalleryDashboard from '../../../components/GalleryDashboard.svelte';
	import type { PageData } from './$types';
	import { createSearchStore, searchHandler } from '../../../lib/stores/search';
	import { onDestroy } from 'svelte';

	export let data: PageData;

	const searchedDashboards = data.dashboards.map((dashboard) => ({
		...dashboard,
		searchTerms: `${dashboard.name} ${dashboard.description}`
	}));

	const searchStore = createSearchStore(searchedDashboards);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">Gallery</h1>
				<FilterComponent bind:value={$searchStore.search} />
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3">
				{#each $searchStore.filtered as dashboard}
					<GalleryDashboard {dashboard} />
				{/each}
			</div>
			<Pagination />
		</div>
	</div>
</main>
