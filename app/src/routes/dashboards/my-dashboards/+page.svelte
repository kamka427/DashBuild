<script lang="ts">
	import DashboardView from '$lib/components/DashboardView.svelte';
	import FilterComponent from '$lib/components/FilterComponent.svelte';
	import GeneralView from '$lib/components/GeneralView.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
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

<svelte:head>
	<title>My Dashboards</title>
</svelte:head>
<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
				<FilterComponent bind:value={$searchStore.search} tags={['te']} teams={['te']} />
			</div>
			<div class="grid grid-cols-2 place-items-center gap-3">
				{#each $searchStore.filtered as dashboard}
					<GeneralView {dashboard} />
				{/each}
			</div>
		</div>
	</div>
</main>
