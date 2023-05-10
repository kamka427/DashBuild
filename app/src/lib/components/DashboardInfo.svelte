<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';

	export let dashboard: Dashboard;

	const isOwner = $page.data.session?.user?.id === dashboard.userId;

	const tags = dashboard.tags.map((tag) => tag);
	if (tags.length === 1 && tags[0] === '') {
		tags.pop();
		tags.push('No tags provided');
	}
</script>

<div class="card-compact card bg-base-300 text-base-content w-full shadow-xl sm:w-1/2">
	<div class="card-body gap-4">
		<h1 class="card-title text-xl">{dashboard.name}</h1>

		<p class="text-lg">
			<b>Description: </b>
			{dashboard.description !== '' ? dashboard.description : 'No description provided'}
		</p>

		<div class="stats shadow">
			<div class="stat flex flex-row sm:flex-wrap">
				<div class="stat-title text-sm">Version</div>
				<div class="stat-value flex text-sm">{dashboard.version}</div>
			</div>
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Tags</div>
				<div class="stat-value text-sm">{tags}</div>
			</div>
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Published</div>
				<div class="stat-value text-sm">
					{dashboard.published === true ? 'True' : 'False'}
				</div>
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Created at</div>
				<div class="stat-value flex text-sm">{dashboard.createdAt}</div>
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat flex flex-row">
				<div class="stat-title text-sm">Updated at</div>
				<div class="stat-value text-sm">
					{dashboard.createdAt}
				</div>
			</div>
		</div>

		<div class="flex justify-between">
			<div class="btn-group justify-start">
				{#if isOwner}
					<button class="btn-error btn" type="submit" form="deleteDashboard">Delete</button>
				{/if}
			</div>

			<div class="btn-group justify-end">
				<button class="btn-secondary btn">
					<a href="/p/copy/{dashboard.id}">Copy</a>
				</button>
				{#if isOwner}
					<button class="btn-primary btn">
						<a href="/p/edit/{dashboard.id}">Edit</a>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
