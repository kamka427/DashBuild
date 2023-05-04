<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import type { PageData } from './$types';

	let colCount = 2;

	export let data: PageData;

	let panelList = data.dashboard.panels.map((panel) => panel.panel);

	console.log(panelList);
</script>

<svelte:head>
	<title>Copy Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs title={data.dashboard.name} />
		<DashboardProperties bind:dashboardName={data.dashboard.name} bind:colCount />
		<div class="btn-group">
			<button class="btn-secondary btn">Discard</button>
			<button class="btn-primary btn">Save Dashboard</button>
		</div>
	</div>
	<div class="grid grid-cols-{colCount}  place-items-start gap-2">
		{#each panelList as panel}
			<PanelPreviewCard {panel} />
		{/each}
		<!-- <NewPanelCard /> -->
	</div>
</main>
