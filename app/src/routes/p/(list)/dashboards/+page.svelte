<script lang="ts">
	import DashboardFilters from '$lib/components/DashboardFilters.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import { createSearchStore, dashboardSearchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { PageData } from './$types';
	import Error from '$lib/components/Error.svelte';
	import Info from '$lib/components/Info.svelte';

	export let data: PageData;

	// Create a search store for the dashboards
	const searchStore = createSearchStore(data.dashboards);

	// Subscribe to changes in the search store
	const unsubscribe = searchStore.subscribe((model) => dashboardSearchHandler(model));

	// Unsubscribe from the search store when the component is destroyed
	onDestroy(() => {
		unsubscribe();
	});

	export let columnsToShow = 2;
</script>

<svelte:head>
	<title>Dashboards</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex items-center justify-between gap-2">
		<BreadCrumbs />
		<Info
			infoMessage="This is the Dashboards page. Here you can find all the dashboards that you have created. You can search for dashboards by name, description and tags. You can also change how many columns you want to see the dashboards in."
		/>
	</div>
	<DashboardFilters
		bind:search={$searchStore.search}
		bind:tag={$searchStore.tagFilter}
		bind:columns={columnsToShow}
		tags={data.tags}
	/>
	<div class="grid grid-cols-{columnsToShow} place-items-center gap-3">
		{#each $searchStore.filtered as dashboard}
			<DashboardCard {dashboard} />
		{/each}
	</div>
	{#if $searchStore.filtered.length === 0}
		<Error errorMessage="No dashboards found" />
	{/if}
</main>
