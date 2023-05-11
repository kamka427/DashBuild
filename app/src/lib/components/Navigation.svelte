<script>
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
			<a class="btn-ghost btn text-xl normal-case" href="/">DashBuild</a>
			{#if $page.data.session}
				<ul class="menu menu-horizontal px-2">
					<li><a href="/p/create">Create</a></li>
					<li><a href="/p/gallery">Gallery</a></li>
					<li><a href="/p/dashboards">Dashboards</a></li>
				</ul>
			{/if}
		</div>
		<div class="navbar-end">
			<div class="menu menu-horizontal items-center gap-6 px-2">
				<select class="select select-bordered" data-choose-theme>
					{#each themeConfig as theme}
						<option value={theme.value}>{theme.key}</option>
					{/each}
				</select>
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
					<a class="btn" href="/auth/signout">Log Out</a>
				{:else}
					<a class="btn-primary btn w-24" href="/auth/signin"> Sign In </a>
				{/if}
			</div>
		</div>
	</div>
</nav>
