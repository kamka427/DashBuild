<nav>
	<ul>
		<li class="title"><a href="/">DashBuild</a></li>
		<li class="navlink"><a href="/">Home</a></li>
		<li class="navlink"><a href="/gallery">Gallery</a></li>
		<li class="navlink"><a href="/dashboards">My Dashboards</a></li>
	</ul>
	<ul>
		<li class="create"><a href="/create">Create</a></li>
		<li class="profile"><a href="/profile">Profile</a></li>
	</ul>
</nav>

<style lang="postcss">
	nav {
		background: rgb(255, 255, 255);
		box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
		padding: 0.7em;
		display: flex;
		justify-content: space-between;
	}

	.title {
		font-size: 1.4em;
		font-weight: semibold;
	}

	ul {
		display: flex;
		align-items: center;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.navlink {
		margin-left: 1em;
	}

	.create {
		margin-left: 1em;
		background: rgb(45, 142, 19);
		color: rgb(255, 255, 255);
		padding: 0.2em 1.4em;
		border-radius: 1em;
	}

	.profile {
		margin-left: 1em;
		background: rgb(50, 50, 50);
		color: rgb(255, 255, 255);
		padding: 0.2em 1.4em;
		border-radius: 1em;
	}
</style>
