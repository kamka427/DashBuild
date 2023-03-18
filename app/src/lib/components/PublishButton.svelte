<script lang="ts">
	export let published: boolean;
	export let dashboardId: string;
</script>

<div class="flex items-center justify-center">
	<form action="?/publishDashboard" method="POST">
		<input type="hidden" name="dashboardId" value={dashboardId} />
		<input type="hidden" name="publishState" value={published} />
		<button
			class="flex rounded-md bg-gray-300 p-2 shadow-md hover:bg-gray-400 dark:bg-zinc-500 dark:hover:bg-zinc-400"
			type="submit"
		>
			Published:
			{#if published}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="green"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="red"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{/if}
		</button>
	</form>
</div>
