<script lang="ts">
	import { page } from '$app/stores';
	import Error from '$lib/components/Error.svelte';

	/**
	 * The error message to display.
	 */
	export let errorMessage = $page?.error?.message;

	if (errorMessage?.includes('Internal Server')) {
		errorMessage =
			'Internal Server Error: Please check if all the required microservices are running.';
	}
</script>

<Error {errorMessage} />
