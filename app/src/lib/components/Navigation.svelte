<script>
	// Import the ThemeSelect component
	import ThemeSelect from './ThemeSelect.svelte';

	// Import the page store and get the user's initials
	import { page } from '$app/stores';
	export const initials = $page.data.session?.user?.name
		?.split(' ')
		.map((/** @type {string[]} */ word) => word[0])
		.join('');
</script>

<nav class="bg-base-300 text-base-content">
	<div class="container navbar mx-auto">
		<div class="navbar-start">
			<div class="dropdown">
				<!-- Hamburger menu button -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<label tabindex="0" class="btn-ghost btn xl:hidden">
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
				<!-- Dropdown menu -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-300 p-2 shadow"
				>
					{#if $page.data.session}
						<li><a href="/p/create">Create</a></li>
						<li><a href="/p/gallery">Gallery</a></li>
						<li><a href="/p/dashboards">Dashboards</a></li>
						<li><a href="/auth/signout">Log Out</a></li>
					{/if}
					<!-- Render the ThemeSelect component -->
					<ThemeSelect />
				</ul>
			</div>
			<!-- DashBuild logo -->
			<a class="btn-ghost btn text-xl normal-case" href="/">DashBuild</a>
			<!-- Navigation links -->
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
			<!-- User info and logout button -->
			<div class="menu menu-horizontal items-center gap-6 px-2">
				<div class="hidden xl:flex">
					<!-- Render the ThemeSelect component -->
					<ThemeSelect />
				</div>
				{#if $page.data.session}
					<!-- User info -->
					<span>
						<p class="text-sm">Signed in as</p>
						<p>{$page.data.session.user?.name}</p>
					</span>
					<!-- User avatar or initials -->
					{#if $page.data.session.user?.image}
						<div class="avatar">
							<div class="w-12 rounded-full">
								<img src={$page.data.session.user.image} alt="The icon of the logged in user." />
							</div>
						</div>
					{:else}
						<div class="placeholder avatar">
							<div class="w-12 rounded-full bg-neutral-focus text-neutral-content">
								<span class="text-xl">
									{initials}
								</span>
							</div>
						</div>
					{/if}
					<!-- Logout button -->
					<a class="btn hidden xl:flex" href="/auth/signout">Log Out</a>
				{:else}
					<!-- Sign in button -->
					<a class="btn-primary btn w-24" href="/auth/signin"> Sign In </a>
				{/if}
			</div>
		</div>
	</div>
</nav>
