<script lang="ts">
	import { element } from 'svelte/internal';

	// Define the props passed to the component
	export let infoMessage = 'There is no info message';
	export let isClosed = true;
</script>

{#if !isClosed}
	<div class="container alert alert-info max-w-[80%] shadow-xl">
		<!-- Info icon -->
		<svg
			class="h-6 w-6 flex-shrink-0"
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			><path
				d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm.5 17h-1v-9h1v9zm-.5-12c.466 0 .845.378.845.845 0 .466-.379.844-.845.844-.466 0-.845-.378-.845-.844 0-.467.379-.845.845-.845z"
			/></svg
		>
		<!-- Info message -->
		<p>{infoMessage}</p>

		<!-- Close button -->
		<button
			class="btn-ghost rounded-btn btn-sm btn"
			on:click={() => {
				isClosed = true;
			}}
		>
			Close info
		</button>
	</div>
{:else}
	<button
		class="btn-info rounded-btn btn-sm btn"
		on:click={() => {
			isClosed = false;
		}}
		><svg
			class="h-6 w-6 flex-shrink-0"
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			><path
				d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm.5 17h-1v-9h1v9zm-.5-12c.466 0 .845.378.845.845 0 .466-.379.844-.845.844-.466 0-.845-.378-.845-.844 0-.467.379-.845.845-.845z"
			/></svg
		>
	</button>
{/if}
