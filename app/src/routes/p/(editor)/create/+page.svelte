<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './$types';
	import Helper from '$lib/components/Helper.svelte';

	export let data: PageData;
	export let form: ActionData;

	export let title: string = '';
	export let description: string = '';
	export let colCount: number = 2;
	export let tags: string[] = [];
	export let published = false;
	export let panelForm: Panel[] = [];

	export let predefinedPanels: any = data.predefinedPanels;
</script>

<svelte:head>
	<title>Create Dashboard</title>
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
