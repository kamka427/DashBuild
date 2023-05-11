<script lang="ts">
	import type { Panel } from '@prisma/client';
	import DashboardProperties from './DashboardProperties.svelte';
	import PanelFormCard from './PanelFormCard.svelte';
	import NewPanelCard from './NewPanelCard.svelte';
	import DashboardForm from './DashboardForm.svelte';
	import type { ActionData } from '../../routes/p/(editor)/create/$types';
	import Error from './Error.svelte';
	import type { panelEntry } from '$lib/utils/types';

	export let title: string;
	export let description: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
	export let panelForm: Panel[];

	export let predefinedPanels: panelEntry[] = [];
	export let form: ActionData;

	export let selectedPanel: panelEntry;


	refreshPositions();
	function addPanel(panelEntry: panelEntry) {
		refreshPositions();
		panelForm = [
			...panelForm,
			{
				id: (panelForm.length + 1).toString(),
				name: `${panelEntry.title}`,
				description: panelEntry.JSON.description || 'No description provided',
				thumbnailPath: panelEntry.thumbnailPath,
				grafanaJSON: {
					...panelEntry.JSON,
					id: panelForm.length + 1
				},
				grafanaUrl: null,
				position: panelForm.length + 1,
				type: panelEntry.fileName,
				width: 1,
				createdAt: null,
				updatedAt: null,
				dashboardId: 'null'
			}
		];
	}

	function refreshPositions() {
		panelForm = panelForm.map((panel, index) => {
			return {
				...panel,
				position: index + 1
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
		panel.position = index + 1;
	}

	export let isLoading = false;

	$: if (form?.error) {
		isLoading = false;
	}
</script>

<div class="flex flex-col gap-4 {isLoading ? 'pointer-events-none animate-pulse' : ''}">
	{#if form?.error}
		<Error errorMessage={form?.error} />
	{/if}
	<div class="flex flex-wrap justify-between gap-4">
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
