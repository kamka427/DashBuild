<script lang="ts">
	import DashboardFilters from '$lib/components/DashboardFilters.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { PageData } from './$types';
	import Error from '$lib/components/Error.svelte';
	import Info from '$lib/components/Info.svelte';

	export let data: PageData;

	const searchStore = createSearchStore(data.dashboards);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	export let columnsToShow = 2;
</script>

<svelte:head>
	<title>Dashboards</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Info
		infoMessage="This is the Dashboards page. Here you can find all the dashboards that you have created. You can search for dashboards by name or tag. You can also filter the dashboards by the number of columns they have."
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
