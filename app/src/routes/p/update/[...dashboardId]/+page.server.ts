import type { PageServerLoad } from './$types';
import { prisma } from '$lib/utils/prisma';
import { fetchPanels } from '$lib/utils/grafanaHandler';

export const load: PageServerLoad = async ({ url }) => {
	return {
		dashboard: prisma.dashboard.findUniqueOrThrow({
			where: {
				id: url.pathname.split('/')[3]
			},
			include: {
				user: true,
				panels: {
					include: {
						panel: true
					}
				}
			}
		}),
		predefinedPanels: fetchPanels()
	};
};
