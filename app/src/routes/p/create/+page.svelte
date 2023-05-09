<script lang="ts">
	import DashboardProperties from '$lib/components/DashboardProperties.svelte';
	import PanelFormCard from '$lib/components/PanelFormCard.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import NewPanelCard from '$lib/components/NewPanelCard.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	export let dashboardName = '';
	export let colCount = 2;
	export let tags: string[] = [];
	export let published = false;

	export let panelForm: Panel[] = [];
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
				updatedAt: null
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

	$: console.log(panelForm);
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
<main
	class="container mx-auto space-y-6
	{isLoading ? 'animate-pulse' : ''}
"
>
	<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
		<BreadCrumbs />
		<DashboardProperties bind:dashboardName bind:colCount bind:tags bind:published />
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

	<form
		action="?/saveDashboard
	
	"
		method="POST"
		use:enhance
	>
		<input type="hidden" value={dashboardName} name="dashboardName" />
		<input type="hidden" value="test desc" name="dashboardDescription" />
		<input type="hidden" value={colCount} name="colCount" />
		<input type="hidden" value={tags} name="tags" />
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
			<button
				type="submit"
				class="btn-primary btn"
				on:click={() => {
					isLoading = true;
				}}
			>
				Save Dashboard</button
			>
		</div>
	</form>
</main>
