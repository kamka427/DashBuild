<script>
	import Pagination from '../../components/Pagination.svelte';

	let tags = ['val1', 'val2', 'val3', 'val4'];
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row items-center">
				<h1 class="text-4xl">Gallery</h1>
				<input
					type="search"
					placeholder="Search for a dashboard"
					class="h-8 rounded-md w-1/2 bg-gray-200 px-2 text-black shadow-lg hover:bg-gray-300"
				/>
                <div class="flex gap-4">
				<select class="text-black h-8 px-2">
					<option value="none">Tags</option>
					{#each tags as tag}
						<option value={tag}>{tag}</option>
					{/each}
				</select>
				<select class="text-black h-8 px-2">
					<option value="none">Teams</option>
					{#each tags as tag}
                        <option value={tag}>{tag}</option>
                    {/each}
				</select>
                </div>
			</div>
			<div class="grid grid-cols-2 grid-rows-1 place-items-center gap-3" />
			<Pagination />
		</div>
	</div>
</main>
