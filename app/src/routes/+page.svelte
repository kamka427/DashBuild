<script lang="ts">
	import { page } from '$app/stores';
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';

	export let dashboards = [
		'src/lib/placeholders/dash1.png',
		'src/lib/placeholders/dash2.png',
		'src/lib/placeholders/dash3.png',
		'src/lib/placeholders/dash4.png',
		'src/lib/placeholders/dash5.png',
		'src/lib/placeholders/dash6.png',
		'src/lib/placeholders/dash1.png',
		'src/lib/placeholders/dash2.png',
		'src/lib/placeholders/dash3.png'
	];
</script>

<main class="container m-12 mx-auto flex flex-col gap-4 dark:text-white">
	<div>
		<h1 class="text-4xl">Welcome to DashBuild</h1>
		<h2 class="text-2xl">Build. Dashboards. Easily.</h2>
	</div>
	{#if browser}
		<Carousel autoplay autoplayDuration={5000} particlesToShow={2}>
			{#each dashboards as dashboard}
				<img src={dashboard} alt="carousel" class="rounded-md" />
			{/each}
		</Carousel>
	{/if}
	<div class="container space-y-6">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, enim temporibus sequi illum
			maxime asperiores iusto aperiam illo nesciunt, quidem perspiciatis! Odit, esse? Eum labore
			aliquam amet possimus asperiores est. Lorem, ipsum dolor sit amet consectetur adipisicing
			elit. Facilis explicabo minus accusantium eligendi, nostrum molestiae adipisci voluptatem
			minima rem velit facere, nam, id cumque exercitationem autem quidem tenetur vel modi.
		</p>
		{#if $page.data.session}
			<div class="space-x-2">
				<button
					class="rounded-3xl bg-green-600 px-6 py-4 text-slate-100 shadow-lg hover:bg-green-800"
					><a href="/dashboards/create"> Create a new Dashboard </a>
				</button>
				<button
					class="rounded-3xl bg-blue-600 px-6 py-4 text-slate-100 shadow-lg hover:bg-blue-800"
				>
					<a href="/dashboards/my-dashboards"> Jump to my Dashboards </a>
				</button>
			</div>
		{/if}
	</div>
</main>
