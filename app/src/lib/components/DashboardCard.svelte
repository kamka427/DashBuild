<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';
	const currentPage = $page.url.pathname.split('/')[2];
	export let dashboard: Dashboard & { user: { team: string } };

	const shortDescription = dashboard.description
		? dashboard.description.length > 120
			? dashboard.description.substring(0, 120) + '...'
			: dashboard.description
		: 'No description provided';
</script>

<main class="card card-compact h-full w-full bg-base-300 text-base-content">
	<figure>
		<img src={dashboard.thumbnailPath} class="w-max shadow-xl" alt="" />
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
			{#if currentPage === 'dashboards'}
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Published</div>
					<div class="stat-value text-sm">{dashboard.published}</div>
				</div>
			{/if}
		</div>
		<div class="card-actions justify-end">
			<div class="btn-group">
				<a href="/p/update/{dashboard.id}" class="btn-secondary btn">
					{#if currentPage === 'gallery'}
						Copy
					{:else}
						Modify
					{/if}
				</a>
				<a href="/p/view/{dashboard.id}" class="btn-primary btn">View</a>
			</div>
		</div>
	</div>
</main>
