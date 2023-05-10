<script lang="ts">
	import { page } from '$app/stores';
	import Error from '$lib/components/Error.svelte';
</script>

<Error errorMessage={$page?.error?.message} />
