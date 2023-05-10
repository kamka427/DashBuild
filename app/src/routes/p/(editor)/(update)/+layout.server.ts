import { fetchPanels } from '$lib/utils/grafanaHandler';
import { prisma } from '$lib/utils/prisma';
import type { PageServerLoad } from '../create/$types';
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
