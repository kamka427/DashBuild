<script lang="ts">
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import PanelCard from '$lib/components/PanelCard.svelte';
	import PublishButton from '$lib/components/PublishButton.svelte';
	import type { Dashboard } from '@prisma/client';
	interface Data {
		dashboard: Dashboard & {
			user: {
				team: string;
			};
			panels: {
				panel: {
					id: string;
					name: string;
					description: string;
					preview: string;
					representation: string;
				};
			}[];
		};
	}
	export let data: Data;

	export let panels = data.dashboard.panels.map((panel) => panel.panel);
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto">
	<BreadCrumbs title={data.dashboard.name} />

	<div class="mt-6 flex gap-2">
		<div class="container max-w-4xl ">
			<img src="../{data.dashboard.preview}" alt="Dashboard" class="rounded-xl" />
		</div>
		<div class="flex flex-col gap-2">
			<div class="stats mx-auto w-full bg-base-300 shadow">
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
			<div class="card-compact card flex-1 bg-base-300 text-base-content shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{data.dashboard.name}</h2>
					<p>{data.dashboard.description}</p>
					<div class="card-actions justify-end">
						<div class="btn-group">
							<form
								action="?/deleteDashboard&dashboardId={data.dashboard.id}"
								method="POST"
								class="btn-error btn"
							>
								<button type="submit"> DELETE </button>
							</form>
							<a href="/p/update/{data.dashboard.id}" class="btn-primary btn">Edit</a>
							<a href="/p/create/{data.dashboard.id}" class="btn-secondary btn">Copy</a>
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
				<PanelCard hideButtons {panel} />
			{/each}
		</div>
	</div>
</div>