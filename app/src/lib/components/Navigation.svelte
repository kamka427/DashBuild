<script>
	import { page } from '$app/stores';

	const availableThemes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];

	const initials = $page.data.session?.user?.name
		?.split(' ')
		.map((word) => word[0])
		.join('');
</script>

<nav class="bg-base-300 text-base-content">
	<div class="container navbar mx-auto">
		<div class="navbar-start">
			<a class="btn-ghost btn text-xl normal-case" href="/">DashBuild</a>
			{#if $page.data.session}
				<ul class="menu menu-horizontal px-1">
					<li><a href="/dashboards/create">Create a new Dashboard</a></li>
					<li><a href="/dashboards/gallery">Gallery</a></li>
					<li><a href="/dashboards/my-dashboards">My Dashboards</a></li>
				</ul>
			{/if}
		</div>
		<div class="navbar-end">
			<div class="menu menu-horizontal items-center gap-6 px-1">
				<div class="flex items-center gap-2">
					<label for="theme-selector">Theme:</label>
					<select class="select" id="theme-selector" data-choose-theme>
						<option value="">System</option>
						{#each availableThemes as theme}
							<option value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
						{/each}
					</select>
				</div>
				{#if $page.data.session}
					<span>
						<p class="text-sm">Signed in as</p>
						<a href="/dashboards/profile" class="link-hover link">{$page.data.session.user?.name}</a
						>
					</span>
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
					<a class="btn" href="/auth/signout">Log Out</a>
				{:else}
					<a class="btn-primary btn w-24" href="/auth/signin"> Sign In </a>
				{/if}
			</div>
		</div>
	</div>
</nav>
