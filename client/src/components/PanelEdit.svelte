<script lang="ts">
	let props = ['prop1', 'prop2', 'prop3'];
	export let source: string
</script>

<div class="flex h-full w-full flex-col gap-3 rounded-lg bg-slate-200 p-2 text-black shadow-lg">
	<h1 class="text-2xl">Customize Panel: Title</h1>
	<div class="flex flex-col gap-6 lg:flex-row">
		<div class="flex flex-col gap-3">
			<img
				src={source}
				class="rounded-lg shadow-lg"
				alt=""
			/>
			<h2 class="text-2xl">Details</h2>
			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum obcaecati dignissimos
				excepturi officiis assumenda consequatur optio enim exercitationem.
			</p>
		</div>
		<div class="flex w-1/2 flex-col gap-3">
			<h2 class="text-2xl">Properties</h2>
			{#each props as prop}
				<div class="flex gap-4">
					<label for={prop}>{prop}:</label>
					<input type="text" id={prop} placeholder={prop} class="rounded-md shadow-md" />
				</div>
			{/each}
		</div>
	</div>
</div>
