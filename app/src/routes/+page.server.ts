import type { PageServerLoad } from './$types';
import { prisma } from '$lib/utils/prisma';

/**
 * Loads the dashboard data for the home page.
 * @returns An object containing the dashboard data.
 */
export const load: PageServerLoad = async () => {
	return {
		dashboards: await prisma.dashboard.findMany({
			where: {
				published: true
			},
			take: 4
		})
	};
};
