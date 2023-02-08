<script>
	import DashboardView from '../../components/DashboardView.svelte';
	import NewPanel from '../../components/NewPanel.svelte';
	import Pagination from '../../components/Pagination.svelte';
	import PanelEdit from '../../components/PanelEdit.svelte';
	import PanelDetails from '../../components/PanelEdit.svelte';
	import PanelView from '../../components/PanelView.svelte';
</script>

<main>
	<div class="container mx-auto my-12 space-y-6 dark:text-white">
		<div class="flex-col space-y-6">
			<div class="flex flex-col justify-between gap-2 lg:flex-row">
				<h1 class="text-4xl">My Dashboards</h1>
			</div>
			<div class="grid grid-cols-2 grid-rows-2 place-items-center gap-3">
				<DashboardView />
				<DashboardView />
			</div>
			<div class="flex flex-col justify-end gap-3 sm:flex-row">
				<button class="rounded-md bg-red-600 px-8 py-2 text-white shadow-lg hover:bg-red-800">
					Discard
				</button>
				<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800">
					Create
				</button>
			</div>
            <Pagination/>
		</div>
	</div>
</main>
