<script>
	import '../app.css';
	import Navigation from '../Navigation.svelte';
</script>

<Navigation />
<slot />

<style lang="postcss">
	:global(body) {
		@apply dark:bg-slate-800;
	}
</style>
