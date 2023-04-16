<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelFormCard from '$lib/components/PanelFormCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import { panelTemplates } from '$lib/configs/panelTemplates.json';
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
					representation: string;
				};
			}[];
		};
		GRAFANA_URL: string;
		GRAFANA_API_TOKEN: string;
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

	export let panelForm: Panel[] = [];

	export let panelTemplateKeys = Object.keys(panelTemplates);

	function getPanelTemplate(panelType: string) {
		return panelTemplates[panelType];
	}

	function addPanel(panelType: string) {
		panelForm = [
			...panelForm,
			{
				id: panelForm.length.toString(),
				name: `Panel ${panelForm.length}`,
				description: 'No description provided',
				preview: `../src/lib/configs/defaultPanelThumbnails/${panelType}.png`,
				representation: getPanelTemplate(panelType)
			}
		];
	}

	function removePanel(panelId: string) {
		panelForm = panelForm.filter((panel) => panel.id !== panelId);
	}

	function drag(ev) {
		ev.dataTransfer.setData('text/plain', ev.target.id);

		console.log(ev.target.id);
		console.log('dragged');
	}
	function drop(ev) {
		let panelId = ev.dataTransfer.getData('text/plain');

		panelForm = [
			...panelForm.filter((panel) => panel.id !== panelId),
			...panelForm.filter((panel) => panel.id === panelId)
		];

		ev.dataTransfer.clearData();
	}

	export let selectedType = '';

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
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs />
		<DashboardProperties bind:dashboardName bind:colCount />
		<div class="btn-group">
			<button class="btn-secondary btn">Discard</button>
			<button
				on:click={() => {
					callGrafanaApi();
				}}
				class="btn-primary btn">Save Dashboard</button
			>
		</div>
	</div>
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
			panels={panelTemplateKeys}
			bind:selectedType
			addAction={() => addPanel(selectedType)}
		/>
	</div>
</main>
