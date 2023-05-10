<script lang="ts">
	import DashboardEditor from '$lib/components/DashboardEditor.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Panel } from '@prisma/client';
	import type { ActionData, PageData } from './copy/[...dashboardId]/$types';

	export let data: PageData;
	export let form: ActionData;

	export let dashboardName = data.dashboard.name;
	export let colCount = data.dashboard.columns;
	export let tags = data.dashboard.tags;
	export let published = data.dashboard.published;
	export const panelList = data.dashboard.panels;
	export let panelForm: Panel[] = panelList;

	export let predefinedPanels: any = data.predefinedPanels;
</script>

<slot />
<main class="container mx-auto space-y-6">
	<BreadCrumbs />
	<DashboardEditor
		{dashboardName}
		{colCount}
		{tags}
		{published}
		{panelForm}
		{form}
		{predefinedPanels}
	/>
</main>
