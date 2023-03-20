<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelCard from '$lib/components/PanelCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';

	interface Data {
		dashboard: {
			name: string;
			panels: {
				panel: {
					id: string;
					name: string;
					description: string;
					preview: string;
					representation: string;
				};
			}[];
		};
	}

	let rowCount = 2;
	let colCount = 2;

	export let data: Data;

	let panelList = data.dashboard.panels.map((panel) => panel.panel);

	console.log(panelList);
</script>

<svelte:head>
	<title>Update Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs title={data.dashboard.name} />
		<DashboardProperties bind:dashboardName={data.dashboard.name} bind:rowCount bind:colCount />
		<div class="btn-group">
			<button class="btn-secondary btn">Discard</button>
			<button class="btn-primary btn">Save Dashboard</button>
		</div>
	</div>
	<div class="grid grid-cols-{colCount} grid-rows-{rowCount} place-items-start gap-2">
		{#each panelList as panel}
			<PanelCard {panel} />
		{/each}
		<NewPanelCard />
	</div>
</main>
