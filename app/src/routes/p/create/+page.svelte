<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelFormCard from '$lib/components/PanelFormCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import type { Dashboard, Panel } from '@prisma/client';

	interface Data {
		dashboard: Dashboard;
		GRAFANA_URL: string;
		GRAFANA_API_TOKEN: string;
		predefinedPanels: string[];
	}

	export let data: Data;

	export const GRAFANA_URL = data.GRAFANA_URL;
	export const GRAFANA_API_TOKEN = data.GRAFANA_API_TOKEN;

	export let dashboardName = '';
	export let colCount = 2;
	export let tags = '';
	export let teamName = '';
	export let published = false;

	export let panelForm: Panel[] = [];
	export let selectedPanel = {} as {
		name: string;
		JSON: {
			description: string;
		};
		thumbnail: string;
	};

	function addPanel(panel: {
		name: string;
		JSON: {
			description: string;
		};
		Python: string;
		thumbnail: string;
	}) {
		panelForm = [
			...panelForm,
			{
				id: panelForm.length.toString(),
				name: `${panel.name}`,
				description: panel.JSON.description || 'No description provided',
				thumbnailPath: panel.thumbnail,
				grafanaJSON: panel.JSON,
				pythonCode: panel.Python,
				grafanaUrl: '',
				width: 1
			}
		];
	}

	$: console.log(panelForm);
	$: console.log(colCount);

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

	// async function callGrafanaApi() {
	// 	let grafanaPayload = {
	// 		dashboard: {
	// 			...dashboardTemplate,
	// 			title: dashboardName,
	// 			panels: panelForm.map((panel) => panel.grafanaJSON)
	// 		}
	// 	};

	// 	const response = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: GRAFANA_API_TOKEN
	// 		},
	// 		body: JSON.stringify(grafanaPayload)
	// 	});

	// 	const data = await response.json();
	// 	console.log(data);
	// }
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
				{panel}
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

	<form action="?/saveDashboard" method="POST" use:enhance class="">
		<input type="hidden" value={dashboardName} name="dashboardName" />
		<input type="hidden" value="test desc" name="dashboardDescription" />
		<input type="hidden" value={colCount} name="colCount" />
		<input type="hidden" value={tags} name="tags" />
		<input type="hidden" value={teamName} name="teamName" />
		<input type="hidden" value={published} name="published" />
		<input type="hidden" value={JSON.stringify(panelForm)} name="panelForm" />
		<div class="btn-group">
			<button class="btn-secondary btn" type="reset">Reset</button>
			<button type="submit" class="btn-primary btn">Save Dashboard</button>
		</div>
	</form>
</main>
