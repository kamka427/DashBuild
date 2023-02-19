<script>
	import Pagination from '../../../components/Pagination.svelte';
	import GalleryDashboard from '../../../components/GalleryDashboard.svelte';

	let tags = ['val1', 'val2', 'val3', 'val4'];
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">Gallery</h1>
				<input
					type="search"
					placeholder="Search for a dashboard"
					class="h-8 w-1/2 rounded-md bg-gray-200 px-2 text-black shadow-lg hover:bg-gray-300"
				/>
				<div class="flex gap-4">
					<select class="h-8 bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300">
						<option value="none">Tags</option>
						{#each tags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
					<select class="h-8 bg-gray-200 p-2 text-black shadow-lg hover:bg-gray-300">
						<option value="none">Teams</option>
						{#each tags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3">
				<GalleryDashboard />
				<GalleryDashboard />
			</div>
			<Pagination />
		</div>
	</div>
</main>
