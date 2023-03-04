<script>
	import DashboardView from '../../../components/DashboardView.svelte';
	import Pagination from '../../../components/Pagination.svelte';

	export let dashboards = [
		'../../src/placeholders/dash1.png',
		'../../src/placeholders/dash2.png',
		'../../src/placeholders/dash3.png',
		'../../src/placeholders/dash4.png',
	];
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3">
				{#each dashboards as dashboard}
					<DashboardView source={dashboard} />
				{/each}
			</div>
			<Pagination />
		</div>
	</div>
</main>
