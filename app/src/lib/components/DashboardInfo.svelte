<script lang="ts">
	// Import the Dashboard type from Prisma and the page store from SvelteKit
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';

	// Define the props passed to the component
	export let dashboard: Dashboard;

	// Check if the current user is the owner of the dashboard
	const isOwner = $page.data.session?.user?.id === dashboard.userId;

	// Define the tags variable based on the dashboard tags
	const tags = dashboard.tags.map((tag) => tag);
	if (tags.length === 1 && tags[0] === '') {
		tags.pop();
		tags.push('No tags provided');
	}
</script>

<div class="card card-compact w-full bg-base-300 text-base-content shadow-xl sm:w-1/2">
	<div class="card-body gap-4">
		<!-- Dashboard name -->
		<h1 class="card-title text-xl">{dashboard.name}</h1>

		<!-- Dashboard description -->
		<p class="text-lg">
			<b>Description: </b>
			{dashboard.description !== '' ? dashboard.description : 'No description provided'}
		</p>

		<!-- Dashboard stats -->
		<div class="stats shadow">
			<!-- Dashboard version -->
			<div class="stat flex flex-row sm:flex-wrap">
				<div class="stat-title text-sm">Version</div>
				<div class="stat-value flex text-sm">{dashboard.version}</div>
			</div>
			<!-- Dashboard tags -->
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Tags</div>
				<div class="stat-value text-sm">{tags}</div>
			</div>
			<!-- Dashboard published status -->
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Published</div>
				<div class="stat-value text-sm">
					{dashboard.published === true ? 'True' : 'False'}
				</div>
			</div>
		</div>

		<!-- Dashboard creation date -->
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Created at</div>
				<div class="stat-value flex text-sm">{dashboard.createdAt}</div>
			</div>
		</div>

		<!-- Dashboard update date -->
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Updated at</div>
				<div class="stat-value text-sm">
					{dashboard.createdAt}
				</div>
			</div>
		</div>

		<!-- Dashboard actions -->
		<div class="flex justify-between">
			<div class="btn-group justify-start">
				<!-- Delete dashboard button (only visible to the owner) -->
				{#if isOwner}
					<button class="btn-error btn" type="submit" form="deleteDashboard">Delete</button>
				{/if}
			</div>

			<div class="btn-group justify-end">
				<!-- Copy dashboard button -->
				<button class="btn-secondary btn">
					<a href="/p/copy/{dashboard.id}">Copy</a>
				</button>
				<!-- Edit dashboard button (only visible to the owner) -->
				{#if isOwner}
					<button class="btn-primary btn">
						<a href="/p/edit/{dashboard.id}">Edit</a>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
