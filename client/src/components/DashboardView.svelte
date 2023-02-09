<div class="flex flex-col gap-3 rounded-md bg-gray-200 p-3 text-black shadow-xl">
	<div class="flex items-center justify-between">
		<h1 class="text-xl">Dashboard Title</h1>
		<div class="flex items-center">
			<p class="text-">Published</p>
			<button>
				<svg height="30" width="30">
					<circle cx="15" cy="15" r="10" stroke="green" stroke-width="3" fill="white" />
				</svg>
			</button>
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
