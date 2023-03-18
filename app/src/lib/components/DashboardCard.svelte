<script lang="ts">
	import type { Dashboard } from '@prisma/client';
	import Published from './PublishButton.svelte';
	import { page } from '$app/stores';
	const currentPage = $page.url.pathname.split('/')[2];
	export let dashboard: Dashboard & { user: { team: string } };
</script>

<main
	class="flex flex-col gap-3 rounded-md bg-gray-200 p-3 text-black shadow-xl dark:bg-zinc-700 dark:text-white"
>
	<section class="flex items-center justify-between">
		<h1 class="text-xl">{dashboard.name} [ver. {dashboard.version}]</h1>
		<section class="flex items-center gap-6">
			{#if currentPage === 'gallery'}
				<p class="rounded-md bg-gray-300 p-2 shadow-md dark:bg-zinc-500">Team: {dashboard.user.team}</p>
			{/if}
			<p class="rounded-md bg-gray-300 p-2 shadow-md dark:bg-zinc-500">Tags: {dashboard.tags.join(" | ")}</p>
			{#if currentPage === 'my-dashboards'}
				<Published published={dashboard.published} />
			{/if}
		</section>
	</section>
	<img src={dashboard.preview} class="w-max rounded-md shadow-xl" alt="" />
	<p>{dashboard.description}</p>
	<section class="flex flex-col justify-end gap-3 lg:flex-row">
		{#if currentPage === 'gallery'}
			<button class="rounded-md bg-cyan-600 px-8 py-2 text-white shadow-lg hover:bg-cyan-800"
				>Copy</button
			>
		{/if}
		{#if currentPage === 'my-dashboards'}
			<button class="rounded-md bg-red-600 px-8 py-2 text-white shadow-lg hover:bg-red-800"
				>Delete</button
			>
			<button class="rounded-md bg-cyan-600 px-8 py-2 text-white shadow-lg hover:bg-cyan-800"
				>Modify</button
			>
		{/if}
		<button class="rounded-md bg-green-600 px-8 py-2 text-white shadow-lg hover:bg-green-800 "
			>View</button
		>
	</section>
</main>
