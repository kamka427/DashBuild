<script>
	import NewPanel from '../../components/NewPanel.svelte';
	import PanelDetails from '../../components/PanelEdit.svelte';
	import PanelView from '../../components/PanelView.svelte';
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex justify-between">
			<h1 class="text-4xl">Create Dashboard</h1>
			<div class="flex gap-2">
				<div class="flex items-center gap-2">
					<label class="font-semibold" for="columns">Columns:</label>
					<input
						id="columns"
						type="number"
						placeholder="2"
						class="h-8 w-12 rounded-md bg-gray-200 text-center text-black shadow-lg hover:bg-gray-300"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label class="font-semibold" for="Rows">Rows:</label>
					<input
						type="number"
						placeholder="2"
						class="h-8 w-12 rounded-md bg-gray-200 text-center text-black shadow-lg hover:bg-gray-300"
					/>
				</div>
			</div>
		</div>
		<div class="flex justify-around">
			<PanelView />
			<NewPanel />
		</div>
	</div>
</main>
