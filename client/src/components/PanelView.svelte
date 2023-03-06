<script lang="ts">
	export let source: string;
	console.log(source);
</script>

<div class="flex flex-col gap-3 rounded-md bg-gray-200 p-3 text-black shadow-xl">
	<div class="flex items-center justify-between">
		<h1 class="text-xl">Panel Title</h1>
		<button>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8 cursor-pointer text-red-800"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="4"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
	<img src={source} class="w-max rounded-md bg-gray-300 shadow-xl" alt="" />
	<div class="flex flex-col justify-end gap-3 lg:flex-row">
		<button class="rounded-md bg-cyan-600 px-8 py-2 text-white shadow-lg hover:bg-green-800 "
			>Resize</button
		>
		<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800"
			>Customize</button
		>
	</div>
</div>
