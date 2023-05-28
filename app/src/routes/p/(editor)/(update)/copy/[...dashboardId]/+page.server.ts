import { saveDashboardAction } from '$lib/utils/formActions';
import type { Actions } from '@sveltejs/kit';

import { fetchPanels } from '$lib/utils/grafanaHandler';
import { prisma } from '$lib/utils/prisma';
import type { PageServerLoad } from './$types';

/**
 * Loads the dashboard data for the specified URL.
 * @param url - The URL of the dashboard.
 * @returns An object containing the dashboard data and the predefined panels.
 */
export const load: PageServerLoad = async ({ url }) => {
	return {
		dashboard: await prisma.dashboard.findUniqueOrThrow({
			where: {
				id: url.pathname.split('/')[3]
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
