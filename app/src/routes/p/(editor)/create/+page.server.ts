import { saveDashboardAction } from '$lib/utils/formActions';
import type { Actions } from '@sveltejs/kit';

/**
 * Defines the actions that can be performed on the dashboard page.
 */
export const actions: Actions = {
	/**
	 * Saves the dashboard data.
	 * @param request - The HTTP request.
	 * @param locals - The SvelteKit locals object.
	 * @param url - The URL of the dashboard.
	 * @returns The result of the saveDashboardAction function.
	 */
	saveDashboard: async ({ request, locals, url }) => await saveDashboardAction(request, locals, url)
};
