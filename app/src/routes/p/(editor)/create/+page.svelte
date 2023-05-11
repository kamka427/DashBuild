<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './$types';
	import Info from '$lib/components/Info.svelte';
	import type { panelEntry } from '$lib/utils/types';

	export let data: PageData;
	export let form: ActionData;

	export let title: string = '';
	export let description: string = '';
	export let colCount: number = 2;
	export let tags: string[] = [];
	export let published = false;
	export let panelForm: Panel[] = [];

	export let predefinedPanels: panelEntry[] = data.predefinedPanels;
</script>

<svelte:head>
	<title>Create Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Info
		infoMessage="This is the dashboard editor page. The page where you can create, edit and copy dashboards. Click on the Plus sign to get started."
	/>
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
