<script lang="ts">
	export let source: string;
</script>

<div class="flex flex-col gap-3 rounded-md bg-gray-200 p-3 text-black shadow-xl dark:bg-zinc-700 dark:text-white">
	<div class="flex items-center justify-between">
		<h1 class="text-xl">Dashboard Title</h1>
		<div class="flex items-center gap-6">
			<p>Team</p>
			<p class="rounded-md bg-orange-300 p-2 shadow-md">Tags...</p>
		</div>
	</div>
	<img src={source} class="w-max rounded-md bg-gray-300 shadow-xl" alt="" />
	<div class="flex flex-col justify-end gap-3 lg:flex-row">
		<button class="rounded-md bg-cyan-600 px-8 py-2 text-white shadow-lg hover:bg-cyan-800 "
			>View</button
		>
		<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800"
			>Copy</button
		>
	</div>
</div>
