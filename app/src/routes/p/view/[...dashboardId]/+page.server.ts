import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { publishDashboardAction, refreshThumbnailsAction } from '$lib/utils/formActions';

/**
 * Loads the dashboard data for the dashboard page.
 * @param locals - The session object.
 * @param url - The URL object.
 * @returns An object containing the dashboard data.
 * @throws An error if the user does not have permission to view the dashboard.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	const dashboard = await prisma.dashboard.findUniqueOrThrow({
		where: {
			id: url.pathname.split('/')[3]
		},
		include: {
			user: true,
			panels: true,
			dashboardIterations: {
				include: {
					dashboard: true
				}
			}
		}
	});

	if (!dashboard.published && dashboard.user.id !== session.user.id) {
		throw error(403, 'You do not have permission to view this dashboard');
	}
	return {
		dashboard
	};
};

/**
 * Defines the actions that can be performed on the dashboard page.
 */
export const actions: Actions = {
	refreshThumbnails: async ({ url }) => await refreshThumbnailsAction(url),
	publishDashboard: async ({ request, locals }) => await publishDashboardAction(request, locals)
};
