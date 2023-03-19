<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelCard from '$lib/components/PanelCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';

	interface Data {
		panels: {
			id: string;
			name: string;
			description: string;
			preview: string;
			representation: string;
		}[];
	}

	let dashboardName = '';
	let rowCount = 2;
	let colCount = 2;

	export let data: Data;

	export let panelForm = data.panels;
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs location="Create Dashboard" />
		<DashboardProperties bind:dashboardName bind:rowCount bind:colCount />
		<div class="btn-group">
			<button class="btn-secondary btn">Discard</button>
			<button class="btn-primary btn">Save Dashboard</button>
		</div>
	</div>
	<div class="grid grid-cols-{colCount} grid-rows-{rowCount} place-items-start gap-2">
		{#each panelForm as panel}
			<PanelCard {panel} />
		{/each}
	</div>
</main>
