<script lang="ts">
	// Import the Carousel component and the page store
	import Carousel from '../lib/components/Carousel.svelte';
	import { page } from '$app/stores';

	// Import the PageData type and the data parameter
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>DashBuild</title>
</svelte:head>

<!-- Display the main content -->
<main class="container mx-auto">
	<div class="flex flex-col items-start gap-3 lg:flex-row">
		<!-- Display the hero section -->
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
				<!-- Display the create and jump buttons if the user is logged in -->
				{#if $page.data.session}
					<div class="card-actions">
						<button class="btn-primary btn shadow-xl"
							><a href="/p/create"> Create a new Dashboard </a>
						</button>
						<button class="btn-secondary btn shadow-xl">
							<a href="/p/dashboards"> Jump to my Dashboards </a>
						</button>
					</div>
				{/if}
			</div>
		</article>
		<!-- Display the Carousel component -->
		<Carousel dashboards={data.dashboards} />
	</div>
</main>
