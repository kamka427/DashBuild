<script lang="ts">
	import DashboardView from '../../../components/DashboardView.svelte';
	import Pagination from '../../../components/Pagination.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ dashboards } = data);
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3">
				{#each dashboards as dashboard}
					<DashboardView {dashboard} />
				{/each}
			</div>
			<Pagination />
		</div>
	</div>
</main>
