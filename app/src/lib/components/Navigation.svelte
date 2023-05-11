<script>
	import ThemeSelect from './ThemeSelect.svelte';

	import { page } from '$app/stores';
	import { themeConfig } from '$lib/config/themeConfig.json';
	export const initials = $page.data.session?.user?.name
		?.split(' ')
		.map((/** @type {string[]} */ word) => word[0])
		.join('');
</script>

<nav class="bg-base-300 text-base-content">
	<div class="navbar container mx-auto">
		<div class="navbar-start">
			<div class="dropdown">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<label tabindex="0" class="btn btn-ghost xl:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/></svg
					>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content bg-base-300 rounded-box mt-3 w-52 p-2 shadow"
				>
					{#if $page.data.session}
						<li><a href="/p/create">Create</a></li>
						<li><a href="/p/gallery">Gallery</a></li>
						<li><a href="/p/dashboards">Dashboards</a></li>
						<li><a href="/auth/signout">Log Out</a></li>
					{/if}
					<ThemeSelect />
				</ul>
			</div>
			<a class="btn-ghost btn text-xl normal-case" href="/">DashBuild</a>
			<div class="hidden xl:flex">
				{#if $page.data.session}
					<ul class="menu menu-horizontal px-2">
						<li><a href="/p/create">Create</a></li>
						<li><a href="/p/gallery">Gallery</a></li>
						<li><a href="/p/dashboards">Dashboards</a></li>
					</ul>
				{/if}
			</div>
		</div>
		<div class="navbar-end">
			<div class="menu menu-horizontal items-center gap-6 px-2">
				<div class="hidden xl:flex">
					<ThemeSelect />
				</div>
				{#if $page.data.session}
					<span>
						<p class="text-sm">Signed in as</p>
						<p>{$page.data.session.user?.name}</p>
					</span>
					{#if $page.data.session.user?.image}
						<div class="avatar">
							<div class="w-12 rounded-full">
								<img src={$page.data.session.user.image} alt="The icon of the logged in user." />
							</div>
						</div>
					{:else}
						<div class="placeholder avatar">
							<div class="bg-neutral-focus text-neutral-content w-12 rounded-full">
								<span class="text-xl">
									{initials}
								</span>
							</div>
						</div>
					{/if}
					<a class="btn hidden xl:flex" href="/auth/signout">Log Out</a>
				{:else}
					<a class="btn-primary btn w-24" href="/auth/signin"> Sign In </a>
				{/if}
			</div>
		</div>
	</div>
</nav>
