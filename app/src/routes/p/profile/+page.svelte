<script lang="ts">
	import { page } from '$app/stores';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const reloadSession = () => {
	const event = new Event('visibilitychange');
	document.dispatchEvent(event);
};
	console.log(data);
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>
<div class="container mx-auto space-y-6">
	<BreadCrumbs />

	<div class="card-compact card bg-base-300 mx-auto max-w-2xl">
		<div class="card-body">
			<img class="max-w-sm" src={$page.data.session?.user?.image} alt="" />
			<h2 class="card-title">{data.user?.name}</h2>
			<p>Email: {data.user?.email}</p>
			<p>Team: {data.user?.team}</p>
		</div>
	</div>
	<form method="POST" action="?/updateProfile" class="card bg-base-300 mx-auto max-w-2xl">
		<div class="form-control">
			<label class="input-group">
				<span>Name</span>
				<input type="text" name="name"
				value="{data.user?.name}"
				class="input input-bordered" />
			</label>
		</div>
		<div class="form-control">
			<label class="input-group">
				<span>Team</span>
				<input type="text" name="team"
				value="{data.user?.team}"
				class="input input-bordered" />
			</label>
		</div>
		<!-- <div class="form-control">
			<label class="input-group">
				<span>Image</span>
				<input type="file" name="image" 
				value="{$page.data.session?.user?.image}"
				class="file-input w-full max-w-xs" />
			</label>
		</div> -->
		<button class="btn btn-primary" 
		on:click={() => reloadSession()}
		>Save</button>
	</form>
</div>
