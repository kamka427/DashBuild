<script lang="ts">
	export let published: boolean;

	const togglePublished = () => {
		published = !published;
	};
</script>

<div class="flex items-center justify-center">
	<button class="flex rounded-md bg-gray-300 hover:bg-gray-400 p-2 shadow-md dark:bg-zinc-500 dark:hover:bg-zinc-400" on:click={togglePublished}>
		Published:
		{#if published}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="green"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
</div>
