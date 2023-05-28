<script lang="ts">
    // Import the DashboardIteration type from Prisma
    import type { DashboardIteration } from '@prisma/client';

    // Define the props passed to the component
    export let iterations: DashboardIteration[];

    // Sort the iterations by version number in descending order
    iterations = iterations.sort((a, b) => b.version - a.version);

    // Copy the Grafana JSON for the given iteration to the clipboard
    const copyToDashboard = async (iteration: DashboardIteration) => {
        await navigator.clipboard.writeText(JSON.stringify(iteration.grafanaJSON));
    };
</script>

<div tabindex="-1" class="collapse-arrow rounded-box collapse border border-base-300 bg-base-100">
    <div class="collapse-title text-xl font-medium">Click for Versions</div>
    <div class="collapse-content">
        <div class="flex flex-col gap-4">
            {#each iterations as iteration}
                <div class="card card-compact h-full w-full bg-base-300 text-base-content shadow-xl">
                    <div class="card-body gap-4">
                        <div class="flex justify-between">
                            <!-- Iteration version number -->
                            <code class="card-title">Version: {iteration.version}</code>
                            <!-- Copy to clipboard button -->
                            <button class="btn-primary btn" on:click={() => copyToDashboard(iteration)}>
                                Copy to clipboard
                            </button>
                        </div>
                        <!-- Grafana JSON code block -->
                        <div class="mockup-code overflow-x-scroll">
                            <code class="whitespace-pre-wrap p-6">
                                {JSON.stringify(iteration.grafanaJSON, null, '\t')}
                            </code>
                        </div>
                        <!-- Iteration creation date -->
                        <code>Created at: {iteration.createdAt}</code>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>