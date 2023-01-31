<script lang="ts">
	import Pagination from './Pagination.svelte';

	// six random images from unsplash in a list
	export let dashboards = [
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png',
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png',
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png',
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png',
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png',
		'https://grafana.com/static/img/screenshots/Modal_dashboards.png'
	];
</script>

<div class="rounded-xl bg-neutral-200 p-3 shadow-lg dark:bg-slate-500">
	<h1 class="pb-3 text-center text-xl">Gallery of already built Dashboards</h1>
	<div class="flex flex-wrap justify-center gap-8">
		{#each dashboards as dash}
			<img class="h-20 rounded-md shadow-lg" src={dash} alt="dashboard" />
		{/each}
	</div>
	<Pagination />
</div>
