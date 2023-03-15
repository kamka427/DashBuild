<script>
	import { page } from '$app/stores';
	import Close from '../svgs/Close.svelte';
</script>

<nav class="py-2 shadow-lg dark:bg-zinc-800 dark:text-slate-100">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a class="text-3xl hover:underline" href="/">DashBuild</a>
			{#if $page.data.session}
				<a class="text-xl hover:underline" href="/">Home</a>
				<a class="text-xl hover:underline" href="/protected/gallery">Gallery</a>
				<a class="text-xl hover:underline" href="/protected/dashboards">My Dashboards</a>
			{/if}
		</div>
		{#if $page.data.session}
			<div class="flex items-center gap-4">
				<a
					class="rounded-2xl bg-green-600 px-6 py-1 text-slate-100 shadow-lg hover:bg-green-800"
					href="/protected/create">Create</a
				>
				<span>
					<p class="text-sm">Signed in as</p>
					<a href="/protected/profile" class="text-md hover:underline"
						>{$page.data.session.user?.name}</a
					>
				</span>
				{#if $page.data.session.user?.image}
					<img src={$page.data.session.user.image} alt="" class="h-8 w-8 rounded-full" />
				{/if}

				<a href="/auth/signout"><Close /></a>
			</div>
		{:else}
			<div class="flex items-center gap-4">
				<a
					class="flex gap-2 rounded-2xl bg-green-600 px-6 py-1 text-slate-100 shadow-lg hover:bg-green-800"
					href="/auth/signin"
				>
					Sign in
				</a>
				<a
					class="flex gap-2 rounded-2xl bg-blue-600 px-6 py-1 text-slate-100 shadow-lg hover:bg-blue-800"
					href="/auth/register"
				>
					Register
				</a>
			</div>
		{/if}
	</div>
</nav>
