<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './$types';
	import Info from '$lib/components/Info.svelte';
	import type { panelEntry } from '$lib/utils/types';

	export let data: PageData;
	export let form: ActionData;

	// Define variables for the dashboard form fields
	export let title = '';
	export let description = '';
	export let colCount = 2;
	export let tags: string[] = [];
	export let published = false;
	export let panelForm: Panel[] = [];

	export let predefinedPanels: panelEntry[] = data.predefinedPanels;
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<div class="flex items-center justify-between gap-2">
		<BreadCrumbs />
		<Info
			infoMessage="This is the dashboard editor page. The page where you can create, edit and copy dashboards. Click on the Plus sign to get started."
		/>
	</div>
	<DashboardEditor
		{title}
		{description}
		{colCount}
		{tags}
		{published}
		{panelForm}
		{form}
		{predefinedPanels}
	/>
</main>
