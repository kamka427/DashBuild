<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import Helper from '$lib/components/Helper.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	export let title = data.dashboard.name;
	export let description = data.dashboard.description || '';
	export let colCount = data.dashboard.columns;
	export let tags = data.dashboard.tags;
	export let published = data.dashboard.published;
	export const panelList = data.dashboard.panels;
	export let panelForm: Panel[] = panelList.sort((a, b) => a.position - b.position);

	export let predefinedPanels: any = data.predefinedPanels;
</script>

<svelte:head>
	<title>Edit Dashboard</title>
</svelte:head>
<main class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Helper
		infoMessage="This is the dashboard editor page. Here you can edit the dashboard you have created. You can change the name, description, number of columns, tags and panels of the dashboard. You can also publish or unpublish the dashboard."
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
