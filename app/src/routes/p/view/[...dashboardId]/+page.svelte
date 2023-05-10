<script lang="ts">
	import { enhance } from '$app/forms';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import Helper from '$lib/components/Helper.svelte';
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';

	import type { ActionData, PageData } from './$types';
	export let data: PageData;

	export const panels = data.dashboard.panels.sort((a, b) => a.position - b.position);
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Helper
		infoMessage="This is a preview of the dashboard. Click Open in Grafana to view the dashboard in Grafana."
	/>
	<div class="btn-group">
		{#if data.dashboard.grafanaUrl !== null}
			<button class="btn-primary btn">
				<a href={data.dashboard.grafanaUrl} target="_blank">Open in Grafana</a>
			</button>
		{/if}
		<button class="btn-error btn" type="submit" form="deleteDashboard">Delete</button>
		<button class="btn-primary btn">
			<a href="/p/edit/{data.dashboard.id}">Edit</a>
		</button>
		<button class="btn-secondary btn">
			<a href="/p/copy/{data.dashboard.id}">Copy</a>
		</button>
		<button class="btn-info btn" type="submit" form="refreshThumbnails">
			Refresh Thumbnails
		</button>
		<PublishButton published={data.dashboard.published} dashboardId={data.dashboard.id} />
	</div>
	<h2 class="text-3xl">Dashboard Information</h2>
	<div class="mt-6 flex gap-2">
		<div class="container w-1/2">
			<img src={data.dashboard.thumbnailPath} alt="Dashboard" class="rounded-xl" />
		</div>
		<div class="card-compact card bg-base-300 text-base-content w-1/2 shadow-xl">
			<div class="card-body gap-4">
				<div class="stats shadow">
					<div class="stat">
						<p class="stat-title">Title</p>
						<h1 class="stat-value text-xl">{data.dashboard.name}</h1>
					</div>
				</div>
				<div class="stats shadow">
					<div class="stat">
						<p class="stat-title">Description</p>
						<p class="stat-value text-lg">
							{data.dashboard.description !== ''
								? data.dashboard.description
								: 'No description provided'}
						</p>
					</div>
				</div>
				<div class="stats shadow">
					<div class="stat flex flex-row">
						<div class="stat-title text-sm">Version</div>
						<div class="stat-value flex text-sm">{data.dashboard.version}</div>
					</div>
					<div class="stat flex flex-row">
						<div class="stat-title text-sm">Tags</div>
						<div class="stat-value text-sm">{data.dashboard.tags}</div>
					</div>
					<div class="stat flex flex-row">
						<div class="stat-title text-sm">Published</div>
						<div class="stat-value text-sm">
							{data.dashboard.published === true ? 'True' : 'False'}
						</div>
					</div>
				</div>
				<div class="stats shadow">
					<div class="stat flex flex-row">
						<div class="stat-title text-sm">Created at</div>
						<div class="stat-value flex text-sm">{data.dashboard.createdAt}</div>
					</div>
				</div>
				<div class="stats shadow">
					<div class="stat flex flex-row">
						<div class="stat-title text-sm">Updated at</div>
						<div class="stat-value text-sm">
							{data.dashboard.createdAt}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="space-y-6">
		<h2 class="text-3xl">Versions</h2>
		<div class="flex gap-4">
			{#each data.dashboard.dashboardIterations as iteration}
				<div class="card-compact card bg-base-300 text-base-content h-full w-1/3 shadow-xl">
					<div class="card-body gap-4">
						<div class="stats shadow">
							<div class="stat">
								<p class="stat-title">Version</p>
								<h1 class="stat-value text-sm">{iteration.version}</h1>
							</div>
						</div>
						<div class="stats shadow">
							<div class="stat">
								<p class="stat-title">grafanaJSON</p>
								<p class="stat-value text-lg">
									{JSON.stringify(iteration.grafanaJSON)}
								</p>
							</div>
						</div>
						<div class="stats shadow">
							<div class="stat flex flex-row">
								<div class="stat-title text-sm">Created at</div>
								<div class="stat-value flex text-sm">{iteration.createdAt}</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-{data.dashboard.columns} gap-4">
		<h2 class="text-3xl">Panels</h2>
		{#each panels as panel}
			<PanelPreviewCard {panel} />
		{/each}
	</div>
</div>

<form id="refreshThumbnails" action="?/refreshThumbnails" method="POST" />

<form
	id="deleteDashboard"
	action="/p/dashboards?/deleteDashboard"
	method="POST"
	on:submit={(e) => {
		if (!confirm('Are you sure you want to delete this dashboard?')) e.preventDefault();
	}}
>
	<input type="hidden" name="dashboardId" id="dashboardId" value={data.dashboard.id} />
</form>
