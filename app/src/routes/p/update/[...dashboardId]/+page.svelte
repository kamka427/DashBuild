<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelFormCard from '$lib/components/PanelFormCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import type { Panel } from '@prisma/client';
	import type { PageData } from './$types';

	export let data: PageData;

	export let dashboardName = data.dashboard.name;
	export let colCount = data.dashboard.columns;
	export let tags = data.dashboard.tags;
	export let teamName = data.dashboard.user.team;
	export let published = data.dashboard.published;

	export const panelList = data.dashboard.panels.map((panel) => panel.panel);

	export let panelForm: Panel[] = panelList;
	export let selectedPanel = {} as {
		title: string;
		JSON: {
			description: string;
		};
		thumbnailPath: string;
	};

	function addPanel(panel: {
		title: string;
		JSON: {
			description: string;
		};
		Python: string;
		thumbnailPath: string;
	}) {
		panelForm = [
			...panelForm,
			{
				id: (panelForm.length + 1).toString(),
				name: `${panel.title}`,
				description: panel.JSON.description || 'No description provided',
				thumbnailPath: panel.thumbnailPath,
				grafanaJSON: {
					...panel.JSON,
					id: panelForm.length + 1
				},
				grafanaUrl: null,
				width: 1
			}
		];
	}

	function removePanel(panelId: string) {
		panelForm = panelForm.filter((panel) => panel.id !== panelId);
	}

	let draggedPanel: Panel;
	let currentPanel: Panel;
	let dragOn = false;

	function drag(ev: { target: { id: string } }) {
		draggedPanel = panelForm.find((panel) => panel.id === ev?.target?.id) as Panel;
	}

	function drop(ev: { target: { id: string } }) {
		currentPanel = panelForm.find((panel) => panel.id === ev?.target?.id) as Panel;

		let draggedPanelIndex = panelForm.findIndex((panel) => panel.id === draggedPanel.id);
		let currentPanelIndex = panelForm.findIndex((panel) => panel.id === currentPanel.id);

		let temp = panelForm[draggedPanelIndex];
		panelForm[draggedPanelIndex] = panelForm[currentPanelIndex];
		panelForm[currentPanelIndex] = temp;
	}
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs />
		<DashboardProperties bind:dashboardName bind:colCount bind:tags bind:teamName bind:published />
	</div>
	<div class="grid grid-cols-{colCount} gap-4">
		{#each panelForm as panel}
			<PanelFormCard
				bind:dragOn
				bind:panel
				{colCount}
				removeAction={() => removePanel(panel.id)}
				dragEvent={(e) => {
					drag(e);
				}}
				dropEvent={(e) => {
					drop(e);
				}}
			/>
		{/each}
		<NewPanelCard
			panels={data.predefinedPanels}
			bind:selectedPanel
			addAction={() => addPanel(selectedPanel)}
		/>
	</div>

	<form action="/p/create?/saveDashboard" method="POST" class="">
		<input type="hidden" value={dashboardName} name="dashboardName" />
		<input type="hidden" value="test desc" name="dashboardDescription" />
		<input type="hidden" value={colCount} name="colCount" />
		<input type="hidden" value={tags} name="tags" />
		<input type="hidden" value={teamName} name="teamName" />
		<input type="hidden" value={published} name="published" />
		<input type="hidden" value={JSON.stringify(panelForm)} name="panelForm" />
		<div class="btn-group">
			<button
				class="btn-secondary btn"
				type="reset"
				on:click={() => {
					panelForm = [];
				}}>Reset</button
			>
			<button type="submit" class="btn-primary btn">Save Dashboard</button>
		</div>
	</form>
</main>
