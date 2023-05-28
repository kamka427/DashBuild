import { saveDashboardAction } from '$lib/utils/formActions';
import { fetchPanels } from '$lib/utils/grafanaHandler';
import { prisma } from '$lib/utils/prisma';
import type { PageServerLoad } from './$types';
import { permissionCheck } from '$lib/utils/validators';
import type { Actions } from '@sveltejs/kit';

/**
 * Loads the dashboard data for the specified URL.
 * @param locals - The SvelteKit locals object.
 * @param url - The URL of the dashboard.
 * @returns An object containing the dashboard data and the predefined panels.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const dashboardId = url.pathname.split('/')[3];

	await permissionCheck(locals, dashboardId, "You don't have permission to edit this dashboard");

	return {
		dashboard: await prisma.dashboard.findUniqueOrThrow({
			where: {
				id: dashboardId
			},
			include: {
				user: true,
				panels: true
			}
		}),
		predefinedPanels: fetchPanels()
	};
};

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
