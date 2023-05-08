<script lang="ts">
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import PanelPreviewCard from '$lib/components/PanelPreviewCard.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	export const panels = data.dashboard.panels
		.map((panel) => panel.panel)
		.sort((a, b) => a.position - b.position);
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto">
	<BreadCrumbs title={data.dashboard.name} />
	<a href={data.dashboard.grafanaUrl} target="_blank" class="btn btn-primary"> Open in Grafana </a>
	<div class="mt-6 flex gap-2">
		<div class="container max-w-4xl">
			<img src="../{data.dashboard.thumbnailPath}" alt="Dashboard" class="rounded-xl" />
		</div>
		<div class="flex flex-col gap-2">
			<div class="stats bg-base-300 mx-auto w-full shadow">
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Version</div>
					<div class="stat-value text-sm">{data.dashboard.version}</div>
				</div>
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Team</div>
					<div class="stat-value text-sm">{data.dashboard.user.team}</div>
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
							<form
								action="/p/dashboards?/deleteDashboard"
								method="POST"
								class="btn-error btn"
								on:submit={(e) => {
									if (!confirm('Are you sure you want to delete this dashboard?'))
										e.preventDefault();
								}}
							>
								<input
									type="hidden"
									name="dashboardId"
									id="dashboardId"
									value={data.dashboard.id}
								/>
								<button type="submit"> DELETE </button>
							</form>
							<a href="/p/update/{data.dashboard.id}" class="btn-primary btn">Edit</a>
							<!-- <a href="/p/create/{data.dashboard.id}" class="btn-secondary btn">Copy</a> -->
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
