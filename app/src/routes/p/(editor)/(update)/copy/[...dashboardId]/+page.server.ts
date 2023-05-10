import { saveDashboardAction } from '$lib/utils/actions';
import type { Actions } from '@sveltejs/kit';


import { fetchPanels } from '$lib/utils/grafanaHandler';
import { prisma } from '$lib/utils/prisma';
import type { PageServerLoad } from './$types';

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


export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) =>
		await saveDashboardAction(request, locals, url)
};
