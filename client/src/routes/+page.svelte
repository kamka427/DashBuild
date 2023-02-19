<script lang="ts">
	import GalleryPreview from '../components/GalleryPreview.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	console.log($page);
</script>

<main class="container m-12 mx-auto flex flex-wrap gap-12 dark:text-slate-100 lg:flex-nowrap">
	<div class="container space-y-6">
		<div>
			<h1 class="text-4xl">Welcome to DashBuild</h1>
			<h2 class="text-2xl">Build. Dashboards. Easily.</h2>
		</div>
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
					><a href="/protected/create"> Create a new Dashboard </a>
				</button>
				<button
					class="rounded-3xl bg-blue-600 px-6 py-4 text-slate-100 shadow-lg hover:bg-blue-800"
				>
					<a href="/protected/dashboards"> Jump to my Dashboards </a>
				</button>
			</div>
		{/if}
	</div>
	<GalleryPreview />
</main>
