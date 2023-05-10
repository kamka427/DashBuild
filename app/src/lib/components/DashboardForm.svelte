<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Panel } from '@prisma/client';
	export let title: string;
    export let description: string;
	export let colCount: number;
	export let tags: string[];
	export let published: boolean;
	export let panelForm: Panel[];

	export let isLoading: boolean;
</script>

<form
class="self-center"
	action="?/saveDashboard"
	method="POST"
	use:enhance
>
	<input type="hidden" value={title} name="title" />
	<input type="hidden" value={description} name="description" />
	<input type="hidden" value={colCount} name="colCount" />
	<input type="hidden" value={tags} name="tags" />
	<input type="hidden" value={published} name="published" />
	<input type="hidden" value={JSON.stringify(panelForm)} name="panelForm" />

	<div class="btn-group">
		<button
			class="btn-secondary btn"
			type="reset"
			on:click={() => {
				panelForm = [];
			}}>Reset</button
		>
		<button
			type="submit"
			class="btn-primary btn"
			on:click={() => {
				isLoading = true;
			}}
		>
			Save Dashboard</button
		>
	</div>
</form>
