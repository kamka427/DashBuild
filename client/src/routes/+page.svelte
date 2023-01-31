<script>
	import Minigallery from '../GalleryPreview.svelte';
</script>

<main class="m-12  flex dark:text-slate-100">
	<div class="space-y-6">
		<div>
			<h1 class="text-4xl">Welcome to DashBuild</h1>
			<h2 class="text-2xl">Build. Dashboards. Easily.</h2>
		</div>
		<p class="w-[80%] text-lg">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, enim temporibus sequi illum
			maxime asperiores iusto aperiam illo nesciunt, quidem perspiciatis! Odit, esse? Eum labore
			aliquam amet possimus asperiores est. Lorem, ipsum dolor sit amet consectetur adipisicing
			elit. Facilis explicabo minus accusantium eligendi, nostrum molestiae adipisci voluptatem
			minima rem velit facere, nam, id cumque exercitationem autem quidem tenetur vel modi.
		</p>
		<div class="space-x-2">
			<button
				class="rounded-3xl bg-green-600 px-6 py-4 text-slate-100 shadow-lg hover:bg-green-800"
			>
				Create a new Dashboard
			</button>
			<button class="rounded-3xl bg-blue-600 px-6 py-4 text-slate-100 shadow-lg hover:bg-blue-800">
				Jump to my Dashboards
			</button>
		</div>
	</div>
	<Minigallery />
</main>
