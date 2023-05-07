import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';

export const load: PageServerLoad = async () => {
	return {
		dashboards: prisma.dashboard.findMany({
			where: {
				published: true
			}
		})
	};
};
