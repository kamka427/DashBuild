<script lang="ts">
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import Helper from '$lib/components/Helper.svelte';
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	export const panels = data.dashboard.panels.sort((a, b) => a.position - b.position);

	console.log(data.dashboard.dashboardIterations);
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto space-y-6">
	<BreadCrumbs />
	<Helper infoMessage='This is a preview of the dashboard. Click "Open in Grafana" to view the dashboard in Grafana.' />
	<a href={data.dashboard.grafanaUrl} target="_blank" class="btn-primary btn"> Open in Grafana </a>
	<div class="mt-6 flex gap-2">
		<div class="container max-w-4xl">
			<img src={data.dashboard.thumbnailPath} alt="Dashboard" class="rounded-xl" />
		</div>
		<div class="flex w-full flex-col gap-2">
			<div class="stats bg-base-300 mx-auto w-full shadow">
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Version</div>
					<div class="stat-value text-sm">{data.dashboard.version}</div>
				</div>

				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Tags</div>
					<div class="stat-value text-sm">{data.dashboard.tags.join(', ')}</div>
				</div>
				<PublishButton published={data.dashboard.published} dashboardId={data.dashboard.id} />
			</div>
			<div class="card-compact card bg-base-300 text-base-content flex-1 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{data.dashboard.name}</h2>
					<p>{data.dashboard.description}</p>
					<div class="card-actions justify-end">
						<div class="btn-group">
							<button class="btn-error btn" type="submit" form="deleteDashboard"> Delete </button>
							<button class="btn-primary btn">
								<a href="/p/edit/{data.dashboard.id}">Edit</a>
							</button>
							<button class="btn-secondary btn">
								<a href="/p/copy/{data.dashboard.id}">Copy</a>
							</button>
							<button class="btn-info btn" type="submit" form="refreshThumbnails" > Refresh Thumbnails </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="my-6 flex flex-col gap-4">
		<h2 class="text-3xl">Panels</h2>
		<div class="grid grid-cols-2 grid-rows-2 place-items-start gap-2">
			{#each panels as panel}
				<PanelPreviewCard {panel} />
			{/each}
		</div>
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
