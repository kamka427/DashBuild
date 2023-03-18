<script lang="ts">
	import { page } from '$app/stores';
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import type { resolvePackageData } from 'vite';

	interface Data {
		dashboards: {
			id: string;
			preview: string;
			published: boolean;
		}[];
	}
	export let data: Data;
</script>

<svelte:head>
	<title>DashBuild</title>
</svelte:head>
<main class="container m-12 mx-auto flex flex-col gap-4 dark:text-white">
	<div class="container space-y-6">
		<div class="flex flex-col items-center gap-2 lg:flex-row lg:items-start">
			<div class="flex flex-col gap-4">
				<div>
					<h1 class="text-4xl">Welcome to DashBuild</h1>
					<h2 class="text-2xl">Build. Dashboards. Easily.</h2>
				</div>
				<p class="container">
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
					<div class="space-x-2">
						<button
							class="rounded-3xl bg-green-600 px-6 py-4 text-gray-200 shadow-lg hover:bg-green-800"
							><a href="/dashboards/create"> Create a new Dashboard </a>
						</button>
						<button
							class="rounded-3xl bg-blue-600 px-6 py-4 text-gray-200 shadow-lg hover:bg-blue-800"
						>
							<a href="/dashboards/my-dashboards"> Jump to my Dashboards </a>
						</button>
					</div>
				{/if}
			</div>
			{#if browser}
				<div class="container w-3/5">
					<Carousel autoplay autoplayDuration={5000} particlesToShow={1}>
						{#each data.dashboards as dashboard}
							<img src={dashboard.preview} alt="carousel" class="rounded-md" />
						{/each}
					</Carousel>
				</div>
			{/if}
		</div>
	</div>
</main>
