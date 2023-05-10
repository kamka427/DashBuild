<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import { page } from '$app/stores';

	export let dashboards: Dashboard[] = [];
</script>

<aside class="carousel container w-full rounded-2xl shadow-xl">
	{#each dashboards as dashboard, index}
		<div id="slide{index + 1}" class="carousel-item relative w-full">
			<div class="card bg-base-300 text-base-content container">
				<div class="card-body">
					<h2 class="card-title">{dashboard.name}</h2>
				</div>
				<figure>
					{#if $page.data.session}
						<a href="/p/view/{dashboard.id}">
							<img
								src={dashboard.thumbnailPath}
								class="w-full"
								alt="A published dashboard in the carousel"
							/>
						</a>
					{:else}
						<img
							src={dashboard.thumbnailPath}
							class="w-full"
							alt="A published dashboard in the carousel"
						/>
					{/if}
				</figure>
			</div>
			<div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
				<a id="next-btn" href="#slide{index}" class="btn-circle btn">❮</a>
				<a href="#slide{index + 2}" class="btn-circle btn">❯</a>
			</div>
		</div>
	{/each}
	{#if dashboards.length === 0}
		<div class="card bg-base-300 text-base-content container">
			<div class="card-body">
				<h2 class="card-title">No dashboards found</h2>
			</div>
		</div>
	{/if}
</aside>
