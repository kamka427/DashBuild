import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';

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
		})
	};
};
