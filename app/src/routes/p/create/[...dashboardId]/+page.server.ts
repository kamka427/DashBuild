import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ url }) => {
	return {
		dashboard: prisma.dashboard.findUnique({
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
		})
	};
};
