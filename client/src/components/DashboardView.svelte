<script>
	import Circle from '../svgs/Circle.svelte';
	import Close from '../svgs/Close.svelte';
</script>

<div class="flex flex-col gap-3 rounded-md bg-gray-200 p-3 text-black shadow-xl">
	<div class="flex items-center justify-between">
		<h1 class="text-xl">Dashboard Title</h1>
		<div class="flex items-center">
			<p class="text-">Published</p>
			<button>
				<Circle />
			</button>
			<button>
				<Close />
			</button>
		</div>
	</div>
	<img
		src="https://grafana.com/static/img/screenshots/Modal_dashboards.png"
		class="w-max rounded-md bg-gray-300 shadow-xl"
		alt=""
	/>
	<div class="flex flex-col justify-end gap-3 lg:flex-row">
		<button class="rounded-md bg-cyan-600 px-8 py-2 text-white shadow-lg hover:bg-cyan-800 "
			>View</button
		>
		<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800"
			>Modify</button
		>
	</div>
</div>
