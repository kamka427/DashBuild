<script lang="ts">
	import Pagination from './Pagination.svelte';

	export let dashboards = [
		'src/placeholders/dash1.png',
		'src/placeholders/dash2.png',
		'src/placeholders/dash3.png',
		'src/placeholders/dash4.png',
		'src/placeholders/dash5.png',
		'src/placeholders/dash6.png',
		'src/placeholders/dash1.png',
		'src/placeholders/dash2.png',
		'src/placeholders/dash3.png',
	];
</script>

<div class="container flex flex-col gap-4 rounded-xl bg-neutral-200 shadow-lg dark:bg-slate-500">
	<h1 class=" p-4 text-center text-xl">Gallery of already built Dashboards</h1>
	<div class="flex flex-wrap justify-center gap-10">
		{#each dashboards as dash}
			<img class="h-24 rounded-md shadow-lg" src={dash} alt="dashboard" />
		{/each}
	</div>
	<Pagination />
</div>
