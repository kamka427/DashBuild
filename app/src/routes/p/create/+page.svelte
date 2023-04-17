<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelFormCard from '$lib/components/PanelFormCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import { dashboardTemplate } from '$lib/configs/dashboardTemplate.json';

	interface Data {
		dashboard: {
			name: string;
			panels: {
				panel: {
					id: string;
					name: string;
					description: string;
					preview: string;
					representation: {
						[key: string]: any;
					};
				};
			}[];
		};
		GRAFANA_URL: string;
		GRAFANA_API_TOKEN: string;
		predefinedPanels: any;
	}

	interface Panel {
		id: string;
		name: string;
		description: string;
		preview: string;
		representation: string;
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
	export let selectedPanel = {};

	function addPanel(panel: {}) {
		panelForm = [
			...panelForm,
			{
				id: panelForm.length.toString(),
				name: `${panel.name}`,
				description: panel.JSON.description || 'No description provided',
				preview: panel.thumbnail || '..src/assets/panel.png',
				representation: panel.JSON
			}
		];
	}

	function removePanel(panelId: string) {
		panelForm = panelForm.filter((panel) => panel.id !== panelId);
	}

	function drag(ev) {
		ev.dataTransfer.setData('text/plain', ev.target.id);
	}
	function drop(ev) {
		let panelId = ev.dataTransfer.getData('text/plain');

		panelForm = [
			...panelForm.filter((panel) => panel.id !== panelId),
			...panelForm.filter((panel) => panel.id === panelId)
		];

		ev.dataTransfer.clearData();
	}

	async function callGrafanaApi() {
		let grafanaPayload = {
			dashboard: {
				...dashboardTemplate,
				title: dashboardName,
				panels: panelForm.map((panel) => panel.representation)
			}
		};

		const response = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			},
			body: JSON.stringify(grafanaPayload)
		});

		const data = await response.json();
		console.log(data);
	}

	function combineDashboardAndPanelData() {
		return {
			data: {
				name: dashboardName,
				published: published,
				tags: tags,
				teamName: teamName,
				panels: panelForm
			}
		};
	}
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<img class="lol" src="" alt="" />
<main class="container mx-auto space-y-6">
	<form action="?/saveDashboard" method="POST">
		<input
			type="hidden"
			name="dashboard"
			value={() => {
				combineDashboardAndPanelData();
			}}
		/>
		<button type="submit" class="btn-primary btn">Call Grafana</button>
	</form>
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs />
		<div class="btn-group">
			<button
				class="btn-secondary btn"
				on:click={() => {
					panelForm = [];
				}}>Reset</button
			>
			<button
				on:click={() => {
					callGrafanaApi();
				}}
				class="btn-primary btn">Save Dashboard</button
			>
		</div>
	</div>
	<DashboardProperties bind:dashboardName bind:colCount bind:tags bind:teamName bind:published />
	<div class="grid grid-cols-{colCount} place-items-start gap-2">
		{#each panelForm as panel}
			<div
				on:dragstart={(e) => {
					drag(e);
				}}
				on:drop={(e) => {
					drop(e);
				}}
				on:dragover={(e) => {
					e.preventDefault();
				}}
				class="panel-card"
				id={panel.id}
				draggable="true"
			>
				<PanelFormCard {panel} removeAction={() => removePanel(panel.id)} />
			</div>
		{/each}
		<NewPanelCard
			panels={data.predefinedPanels}
			bind:selectedPanel
			addAction={() => addPanel(selectedPanel)}
		/>
	</div>
</main>
