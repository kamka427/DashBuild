<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import DashboardInfo from '$lib/components/DashboardInfo.svelte';
	import DashboardIterations from '$lib/components/DashboardIterations.svelte';
	import Info from '$lib/components/Info.svelte';
	import PanelGrid from '$lib/components/PanelGrid.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';
	import type { PageData } from './$types';

	/**
	 * The data object containing the dashboard data.
	 */
	export let data: PageData;

	/**
	 * The panels array sorted by position.
	 */
	export const panels = data.dashboard.panels.sort((a, b) => a.position - b.position);

	/**
	 * A boolean indicating whether the user is the owner of the dashboard.
	 */
	export const isOwner = $page.data.session?.user?.id === data.dashboard.userId;

	/**
	 * A boolean indicating whether the page is currently loading.
	 */
	export let isLoading = false;
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto space-y-6">
	<div class="flex items-center justify-between gap-2">
		<BreadCrumbs />
		<Info
			infoMessage="This is the Dashboard details page. The page where you can view the details of a dashboard. Click on the Versions or Panels section to see more information."
		/>
	</div>
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
				<img
					src={data.dashboard.thumbnailPath + '?time=' + Date.now()}
					alt="Dashboard thumbnail"
					class="rounded-xl"
				/>
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
				isLoading = false;
				invalidateAll();
				goto(`/p/view/${data.dashboard.id}?time=${Date.now()}`);
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
