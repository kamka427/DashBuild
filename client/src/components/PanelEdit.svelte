<script>
	let props = ['prop1', 'prop2', 'prop3'];
</script>

<div class="container h-96 rounded-lg bg-slate-200 p-2 text-black shadow-lg">
	<h1 class="text-4xl">Customize Panel</h1>
	<div class="flex gap-6">
		<div class="flex w-1/2 flex-col">
			<img
				src="https://grafana.com/static/img/screenshots/Modal_dashboards.png"
				class="rounded-lg shadow-lg"
				alt=""
			/>
			<h2 class="text-2xl">Details</h2>
			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum obcaecati dignissimos
				excepturi officiis assumenda consequatur optio enim exercitationem, quae voluptate, veniam
				hic modi sapiente beatae quaerat facere sed quas fugiat.
			</p>
		</div>
		<div class="flex w-1/2 flex-col">
			<h2 class="text-2xl">Properties</h2>
			{#each props as prop}
				<div class="flex gap-4">
					<label for={prop}>{prop}</label>
					<input type="text" id={prop} placeholder={prop} />
				</div>
			{/each}
		</div>
	</div>
</div>
