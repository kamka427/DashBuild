<script lang="ts">
	import type { Panel } from '@prisma/client';
	import DashboardProperties from './DashboardProperties.svelte';
	import PanelFormCard from './PanelFormCard.svelte';
	import NewPanelCard from './NewPanelCard.svelte';
	import DashboardForm from './DashboardForm.svelte';
	import type { ActionData } from '../../routes/p/(editor)/create/$types';

	export let dashboardName: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
	export let panelForm: Panel[];


    export let predefinedPanels: any
	export let form: ActionData;

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
				position: panelForm.length + 1,
				width: 1,
				createdAt: null,
				updatedAt: null,
				dashboardId: 'null'
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
		draggedPanel = panelForm.find((panel) => String(panel.position) === ev?.target?.id) as Panel;
	}

	function drop(ev: { target: { id: string } }) {
		currentPanel = panelForm.find((panel) => String(panel.position) === ev?.target?.id) as Panel;

		let draggedPanelIndex = panelForm.findIndex(
			(panel) => panel.position === draggedPanel.position
		);
		let currentPanelIndex = panelForm.findIndex(
			(panel) => panel.position === currentPanel.position
		);

		let temp = panelForm[draggedPanelIndex];
		panelForm[draggedPanelIndex] = panelForm[currentPanelIndex];
		panelForm[currentPanelIndex] = temp;

		swapIndexes(panelForm[draggedPanelIndex], draggedPanelIndex);
		swapIndexes(panelForm[currentPanelIndex], currentPanelIndex);
	}

	function swapIndexes(panel: Panel, index: number) {
		panel.position = index;
	}

	export let isLoading = false;

	$: if (form?.error) {
		isLoading = false;
	}
</script>

<div class="flex flex-col gap-4 {isLoading ? 'pointer-events-none animate-pulse' : ''}">
	<DashboardProperties bind:dashboardName bind:colCount bind:tags bind:published />
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
			panels={predefinedPanels}
			bind:selectedPanel
			addAction={() => addPanel(selectedPanel)}
		/>
	</div>
	<DashboardForm bind:isLoading {dashboardName} {colCount} {tags} {published} {panelForm} />
</div>
