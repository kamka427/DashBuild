<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import Published from './PublishButton.svelte';
	import { page } from '$app/stores';
	const currentPage = $page.url.pathname.split('/')[2];
	export let dashboard: Dashboard & { user: { team: string } };

	const shortDescription = dashboard.description
		? dashboard.description.length > 120
			? dashboard.description.substring(0, 120) + '...'
			: dashboard.description
		: 'No description provided';
</script>

<main class="card card-compact bg-base-300 text-base-content h-full w-full">
	<figure>
		<img src={dashboard.preview} class="w-max shadow-xl" alt="" />
	</figure>
	<div class="card-body gap-4">
		<h1 class="card-title">{dashboard.name}</h1>
		<p>{shortDescription}</p>
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Version</div>
				<div class="stat-value text-sm">{dashboard.version}</div>
			</div>

			{#if currentPage === 'gallery'}
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Team</div>
					<div class="stat-value text-sm">{dashboard.user.team}</div>
				</div>
			{/if}
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Tags</div>
				<div class="stat-value text-sm">{dashboard.tags.join(', ')}</div>
			</div>
			{#if currentPage === 'my-dashboards'}
				<Published published={dashboard.published} dashboardId={dashboard.id} />
			{/if}
		</div>
		<div class="card-actions justify-end">
			<form action="?/deleteDashboard" method="POST">
				<input type="hidden" name="dashboardId" value={dashboard.id} />
				<div class="btn-group">
					{#if currentPage === 'gallery'}
						<button class="btn-secondary btn">Copy</button>
					{/if}
					{#if currentPage === 'my-dashboards'}
						<button class="btn-error btn" type="submit">Delete</button>
						<button class="btn-secondary btn">Modify</button>
					{/if}
					<button class="btn-primary btn">View</button>
				</div>
			</form>
		</div>
	</div>
</main>
