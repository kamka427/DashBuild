<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import DashboardInfo from '$lib/components/DashboardInfo.svelte';
	import DashboardIterations from '$lib/components/DashboardIterations.svelte';
	import Helper from '$lib/components/Helper.svelte';
	import PanelGrid from '$lib/components/PanelGrid.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	export const panels = data.dashboard.panels.sort((a, b) => a.position - b.position);

	export const isOwner = $page.data.session?.user?.id === data.dashboard.userId;

	export let isLoading = false;
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Helper
		infoMessage="This is a preview of the dashboard. Click Open in Grafana to view the dashboard in Grafana."
	/>
	<div class="container mx-auto space-y-6 {isLoading ? 'pointer-events-none animate-pulse' : ''}">
		<div
			class="flex flex-wrap justify-between gap-4 {isLoading
				? 'pointer-events-none animate-pulse'
				: ''}"
		>
			<h2 class="text-3xl">Dashboard Information</h2>
			<div class="btn-group">
				{#if data.dashboard.grafanaUrl !== null}
					<button class="btn-primary btn">
						<a href={data.dashboard.grafanaUrl} target="_blank">Open in Grafana</a>
					</button>
				{/if}
				{#if isOwner}
					<button class="btn-info btn" type="submit" form="refreshThumbnails">
						Refresh Thumbnails
					</button>
					<PublishButton published={data.dashboard.published} dashboardId={data.dashboard.id} />
				{/if}
			</div>
		</div>
		<div class="mt-6 flex flex-wrap gap-2 sm:flex-nowrap">
			<div class=" container w-full sm:w-1/2">
				<img src={data.dashboard.thumbnailPath} alt="Dashboard" class="rounded-xl" />
			</div>
			<DashboardInfo dashboard={data.dashboard} />
		</div>
		<DashboardIterations iterations={data.dashboard.dashboardIterations} />
		<PanelGrid {panels} />
	</div>
</div>

<form
	id="refreshThumbnails"
	action="?/refreshThumbnails"
	method="POST"
	use:enhance={() => {
		isLoading = true;
		return async ({ result }) => {
			console.log(result);
			if (result.status === 200) {
				invalidateAll();
				goto(`/p/dashboards/${data.dashboard.id}`);
			}
		};
	}}
/>

<form
	id="deleteDashboard"
	action="/p/dashboards?/deleteDashboard"
	method="POST"
	on:submit={(e) => {
		if (!confirm('Are you sure you want to delete this dashboard?')) e.preventDefault();
	}}
	use:enhance={() => {
		return async ({ result }) => {
			if (result.status === 200) {
				goto('/p/dashboards');
			}
		};
	}}
>
	<input type="hidden" name="dashboardId" id="dashboardId" value={data.dashboard.id} />
</form>
