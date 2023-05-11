<script lang="ts">
	import type { Panel } from '@prisma/client';
	import DashboardProperties from './DashboardProperties.svelte';
	import PanelFormCard from './PanelFormCard.svelte';
	import NewPanelCard from './NewPanelCard.svelte';
	import DashboardForm from './DashboardForm.svelte';
	import type { ActionData } from '../../routes/p/(editor)/create/$types';
	import Error from './Error.svelte';

	export let title: string;
	export let description: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
	export let panelForm: Panel[];

	export let predefinedPanels: any;
	export let form: ActionData;

	export let selectedPanel = {} as {
		title: string;
		JSON: {
			description: string;
		};
		thumbnailPath: string;
	};
	refreshPositions();
	function addPanel(panel: {
		title: string;
		JSON: {
			description: string;
		};
		thumbnailPath: string;
	}) {
		refreshPositions();
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

	function refreshPositions() {
		panelForm = panelForm.map((panel, index) => {
			console.log(panel);
			return {
				...panel,
				position: index + 1,
			};
		});
	}

	$: refreshPositions();

	function removePanel(panelId: string) {
		panelForm = panelForm.filter((panel) => panel.id !== panelId);
		refreshPositions();
	}

	let draggedPanel: Panel;
	let currentPanel: Panel;
	let dragOn = false;

	function dragPanel(ev: { target: { id: string } }) {
		draggedPanel = panelForm.find((panel) => panel.position === parseInt(ev?.target?.id)) as Panel;
	}

	function dropPanel(ev: { target: { id: string } }) {
		currentPanel = panelForm.find((panel) => panel.position === parseInt(ev?.target?.id)) as Panel;

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
		console.log(index);
		panel.position = index +1;
	}

	export let isLoading = false;

	$: if (form?.error) {
		isLoading = false;
	}

	$: console.log(panelForm);
</script>

<div class="flex flex-col gap-4 {isLoading ? 'pointer-events-none animate-pulse' : ''}">
	{#if form?.error}
		<Error errorMessage={form?.error} />
	{/if}
	<div class="flex flex-wrap justify-between">
		<DashboardProperties bind:title bind:description bind:colCount bind:tags bind:published />
		<DashboardForm
			bind:isLoading
			{title}
			{description}
			{colCount}
			{tags}
			{published}
			bind:panelForm
		/>
	</div>
	<div class="grid grid-cols-{colCount} gap-4">
		{#each panelForm as panel}
			<PanelFormCard
				bind:dragOn
				bind:panel
				{colCount}
				removeAction={() => removePanel(panel.id)}
				dragEvent={(e) => {
					dragPanel(e);
				}}
				dropEvent={(e) => {
					dropPanel(e);
				}}
			/>
		{/each}
		<NewPanelCard
			panels={predefinedPanels}
			bind:selectedPanel
			addAction={() => addPanel(selectedPanel)}
		/>
	</div>
</div>
