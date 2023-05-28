<script lang="ts">
	// Import the Dashboard type from Prisma and the page store from SvelteKit
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';

	// Define the props passed to the component
	export let dashboard: Dashboard;

	// Define the currentPage variable based on the current page URL
	const currentPage = $page.url.pathname.split('/')[2];

	// Define the shortDescription and tags variables based on the dashboard object
	const shortDescription = dashboard.description
		? dashboard.description.slice(0, 70) + '...'
		: 'No description provided';
	const tags =
		dashboard.tags.join(', ').length > 0 ? dashboard.tags.join(', ') : 'No tags provided';
</script>

<main class="card card-compact h-full w-full bg-base-300 text-base-content shadow-xl">
	<figure>
		<a href="/p/view/{dashboard.id}">
			<img src={dashboard.thumbnailPath} class="w-max shadow-xl" alt="Dashboard thumbnail" />
		</a>
	</figure>
	<div class="card-body gap-4">
		<h1 class="card-title text-xl">{dashboard.name}</h1>

		<p class="text-lg">
			<b>Description: </b>
			{shortDescription}
		</p>
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Version</div>
				<div class="stat-value flex text-sm">{dashboard.version}</div>
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
					<a href="/p/copy/{dashboard.id}" class="btn-secondary btn"> Copy </a>
				{:else}
					<a href="/p/edit/{dashboard.id}" class="btn-secondary btn"> Edit </a>
				{/if}
				<a href="/p/view/{dashboard.id}" class="btn-primary btn">View</a>
			</div>
		</div>
	</div>
</main>
