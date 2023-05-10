<script lang="ts">
	import { page } from '$app/stores';

	export let base: string | null =
		$page.url.pathname.split('/')[2].slice(0, 1).toUpperCase() +
		$page.url.pathname.split('/')[2].slice(1);
</script>

<div class="breadcrumbs text-base-content">
	<ul>
		<li><a class="text-2xl" href="/">DashBuild</a></li>
		<li><p class="text-2xl">{base}</p></li>
	</ul>
</div>
