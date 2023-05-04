<script lang="ts">
	import DashboardFilters from '$lib/components/DashboardFilters.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Dashboard } from '@prisma/client';

	interface Data {
		dashboards: Dashboard;
		teams: {
			team: string;
		}[];
		tags: {
			tags: string[];
		}[];
	}
	export let data: Data;

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
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs />
		<DashboardFilters
			bind:search={$searchStore.search}
			bind:tag={$searchStore.tagFilter}
			bind:team={$searchStore.teamFilter}
			bind:columns={columnsToShow}
			{data}
		/>
	</div>
	<div class="grid grid-cols-{columnsToShow} place-items-center gap-3">
		{#each $searchStore.filtered as dashboard}
			<DashboardCard {dashboard} />
		{/each}
	</div>
</main>
