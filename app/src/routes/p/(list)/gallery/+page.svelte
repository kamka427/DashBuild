<script lang="ts">
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import DashboardFilters from '$lib/components/DashboardFilters.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import type { PageData } from './$types';
	import Error from '$lib/components/Error.svelte';
	import Info from '$lib/components/Info.svelte';

	export let data: PageData;

	// Create a search store for the published dashboards
	const searchStore = createSearchStore(data.dashboards);

	// Subscribe to changes in the search store
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	// Unsubscribe from the search store when the component is destroyed
	onDestroy(() => {
		unsubscribe();
	});

	export let columnsToShow = 2;
</script>

<svelte:head>
	<title>Gallery</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Info
		infoMessage="This is the gallery page. Here you can find all the dashboards that have been published by other users.  You can search for dashboards by name, description and tags. You can also change how many columns you want to see the dashboards in."
	/>
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
