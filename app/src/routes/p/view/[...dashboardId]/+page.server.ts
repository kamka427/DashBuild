import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { publishDashboardAction, refreshThumbnailsAction } from '$lib/utils/actions';

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

export const actions: Actions = {
	refreshThumbnails: async ({ url }) => await refreshThumbnailsAction(url),
	publishDashboard: async ({ request, locals }) => await publishDashboardAction(request, locals)
};
