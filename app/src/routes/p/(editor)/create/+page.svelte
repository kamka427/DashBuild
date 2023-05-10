<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './$types';

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
