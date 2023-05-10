<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';
	const currentPage = $page.url.pathname.split('/')[2];
	export let dashboard: Dashboard;

	const shortDescription = dashboard.description
		? dashboard.description.length > 120
			? dashboard.description.substring(0, 120) + '...'
			: dashboard.description
		: 'No description provided';
	console.log(dashboard.tags);
	console.log(dashboard.tags.length);
	const tags =
		dashboard.tags.join(', ').length > 0 ? dashboard.tags.join(', ') : 'No tags provided';
</script>

<main class="card card-compact bg-base-300 text-base-content h-full w-full shadow-xl">
	<figure>
		<a href="/p/view/{dashboard.id}">
			<img src={dashboard.thumbnailPath} class="w-max shadow-xl" alt="Dashboard thumbnail" />
		</a>
	</figure>
	<div class="card-body gap-4">
		<div class="stats shadow">
			<div class="stat">
				<p class="stat-title">Title</p>
				<h1 class="stat-value text-xl">{dashboard.name}</h1>
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat">
				<p class="stat-title">Short description</p>
				<p class="stat-value text-lg">{shortDescription}</p>
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Version</div>
				<div class="stat-value text-sm">{dashboard.version}</div>
			</div>
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Tags</div>
				<div class="stat-value text-sm">{tags}</div>
			</div>
			{#if currentPage === 'dashboards'}
				<div class="stat flex flex-row">
					<div class="stat-title text-sm">Published</div>
					<div class="stat-value text-sm">{dashboard.published === true ? 'True' : 'False'}</div>
				</div>
			{/if}
		</div>
		<div class="card-actions justify-end">
			<div class="btn-group">
				{#if currentPage === 'gallery'}
					<a href="/p/edit/{dashboard.id}" class="btn-secondary btn"> Edit </a>
				{:else}
					<a href="/p/copy/{dashboard.id}" class="btn-secondary btn"> Copy </a>
				{/if}
				<a href="/p/view/{dashboard.id}" class="btn-primary btn">View</a>
			</div>
		</div>
	</div>
</main>
