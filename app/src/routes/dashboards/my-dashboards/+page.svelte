<script lang="ts">
	import FilterComponent from '$lib/components/FilterComponent.svelte';
	import GeneralView from '$lib/components/GeneralView.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	interface Data {
		dashboards: {
			id: string;
			name: string;
			description: string;
			tags: string[];
			user: {
				team: string;
			};
		}[];
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
</script>

<svelte:head>
	<title>My Dashboards</title>
</svelte:head>
<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
				<FilterComponent
					bind:search={$searchStore.search}
					bind:tag={$searchStore.tagFilter}
					bind:team={$searchStore.teamFilter}
					{data}
				/>
			</div>
			<div class="grid grid-cols-2 place-items-center gap-3">
				{#each $searchStore.filtered as dashboard}
					<GeneralView {dashboard} />
				{/each}
			</div>
		</div>
	</div>
</main>
