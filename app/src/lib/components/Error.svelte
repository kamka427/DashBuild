<script lang="ts">
	// Define the props passed to the component
	export let errorMessage = 'Something went wrong. Please try again later.';
</script>

<div class="container alert alert-error mx-auto shadow-xl">
	<div>
		<!-- Error icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 flex-shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<!-- Error message -->
		<span>
			{errorMessage}
		</span>
	</div>
</div>
