<script>
	import NewPanel from '../../components/NewPanel.svelte';
	import PanelEdit from '../../components/PanelEdit.svelte';
	import PanelDetails from '../../components/PanelEdit.svelte';
	import PanelView from '../../components/PanelView.svelte';
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">Create Dashboard</h1>
				<div class="flex flex-col gap-2 sm:flex-row">
					<div class="flex items-center gap-2">
						<label class="font-semibold" for="dashboardtitle">Dashboard title:</label>
						<input
							id="dashboardtitle"
							type="text"
							placeholder="lorem"
							class="h-8 rounded-md bg-gray-200 px-2 text-black shadow-lg hover:bg-gray-300"
						/>
					</div>
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
			<div class="grid grid-cols-2 grid-rows-2 gap-3 place-items-center">
				<PanelView />
				<PanelView />
				<PanelEdit />
				<NewPanel />
			</div>
			<div class="flex flex-col justify-end gap-3 sm:flex-row">
				<button class="rounded-md bg-red-600 px-8 py-2 text-white shadow-lg hover:bg-red-800">
					Discard
				</button>
				<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800">
					Create
				</button>
			</div>
		</div>
	</div>
</main>
