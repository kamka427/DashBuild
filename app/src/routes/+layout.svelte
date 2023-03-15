<script>
	import '../app.css';
	import Navigation from '../components/Navigation.svelte';
</script>

<Navigation />
<slot />

<style lang="postcss">
	:global(body) {
		@apply dark:bg-zinc-900;
	}
</style>
