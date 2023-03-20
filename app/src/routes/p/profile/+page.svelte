<script lang="ts">
	import { page } from '$app/stores';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>
<div class="container mx-auto space-y-6">
	<BreadCrumbs />

	<div class="card-compact card bg-base-300">
		<div class="card-body">
			<h2 class="card-title">{$page.data.session?.user?.name}</h2>
			<p>Email: {$page.data.session?.user?.email}</p>
		</div>
	</div>
</div>
