<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import DashboardView from '../../../components/DashboardView.svelte';
	import FilterComponent from '../../../components/FilterComponent.svelte';
	import type { PageData } from './$types';

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
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
				<FilterComponent bind:value={$searchStore.search} />
			</div>
			<div class="grid grid-cols-1 grid-rows-1 place-items-center gap-3">
				{#each $searchStore.filtered as dashboard}
					<DashboardView {dashboard} />
				{/each}
			</div>
		</div>
	</div>
</main>
