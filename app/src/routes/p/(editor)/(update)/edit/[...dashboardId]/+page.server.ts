import { saveDashboardAction } from '$lib/utils/actions';
import { fetchPanels } from '$lib/utils/grafanaHandler';
import { prisma } from '$lib/utils/prisma';
import type { PageServerLoad } from './$types';
import { permissionCheck } from '$lib/utils/validators';
import type { Actions } from '@sveltejs/kit';

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

export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) => await saveDashboardAction(request, locals, url)
};
