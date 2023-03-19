<script lang="ts">
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { Dashboard } from '@prisma/client';
	interface Data {
		dashboard: Dashboard & {
			user: {
				team: string;
			};
		};
	}
	export let data: Data;
</script>

<svelte:head>
	<title>{data.dashboard.name}</title>
</svelte:head>

<div class="container mx-auto">
	<BreadCrumbs location={data.dashboard.name} />

	<div class="mt-6 flex gap-2">
		<div class="container max-w-4xl ">
			<img src="../{data.dashboard.preview}" alt="Dashboard" class="rounded-xl" />
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
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Published</div>
					<div class="stat-value text-sm">{data.dashboard.published === true ? 'Yes' : 'No'}</div>
				</div>
			</div>
			<div class="card card-compact bg-base-300 text-base-content  w-full shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{data.dashboard.name}</h2>
					<p class="h-6">{data.dashboard.description}</p>
					<div class="card-actions justify-end">
						<div class="btn-group">
							<button class="btn btn-error">Delete</button>
							<button class="btn btn-primary">Edit</button>
							<button class="btn btn-secondary">Copy</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
