<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>DashBuild</title>
</svelte:head>
<main class="container mx-auto">
	<div class="flex flex-col items-start gap-3 lg:flex-row">
		<article class="hero text-base-content">
			<div class="hero-content flex-col items-start">
				<h1 class="text-4xl">Welcome to DashBuild</h1>
				<h2 class="text-2xl">Build. Dashboards. Easily.</h2>
				<p class="">
					Welcome to our new web app, where you can easily build and share dashboards to monitor and
					visualize your data. With our intuitive user interface, you can quickly create custom
					dashboards with a variety of charts, graphs, and visualizations to suit your needs. Once
					you've created your dashboard, you can easily deploy it to Grafana, a powerful and
					flexible platform for data visualization and monitoring. Whether you're a data analyst,
					engineer, or business owner, our web app makes it easy to create and share compelling
					dashboards to help you make informed decisions and stay on top of your data. Sign up today
					and start building your own dashboards in minutes!
				</p>
				{#if $page.data.session}
					<div class="card-actions">
						<button class="btn-primary btn"
							><a href="/p/create"> Create a new Dashboard </a>
						</button>
						<button class="btn-secondary btn">
							<a href="/p/dashboards"> Jump to my Dashboards </a>
						</button>
					</div>
				{/if}
			</div>
		</article>
		<aside class="container carousel w-full ">
			{#each data.dashboards as dashboard, index}
				<div id="slide{index + 1}" class="carousel-item relative w-full">
					<div class="container card bg-base-300 text-base-content">
						<div class="card-body">
							<h2 class="card-title">{dashboard.name}</h2>
						</div>
						<figure>
							<img
								src={dashboard.thumbnailPath}
								class="w-full"
								alt="A published dashboard in a carousel."
							/>
						</figure>
					</div>
					<div
						class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
					>
						<a id="next-btn" href="#slide{index}" class="btn-circle btn">❮</a>
						<a href="#slide{index + 2}" class="btn-circle btn">❯</a>
					</div>
				</div>
			{/each}
		</aside>
	</div>
</main>
