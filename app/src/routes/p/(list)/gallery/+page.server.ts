import type { PageServerLoad } from './$types';
import { prisma } from '$lib/utils/prisma';

/**
 * Loads the published dashboards and their tags for the dashboard gallery page.
 * @returns An object containing the published dashboards and their tags.
 */
export const load: PageServerLoad = async () => {
	return {
		dashboards: await prisma.dashboard.findMany({
			include: {
				user: true
			},
			where: {
				published: true
			},
			orderBy: {
				updatedAt: 'desc'
			}
		}),
		tags: await prisma.dashboard.findMany({
			select: {
				tags: true
			}
		})
	};
};
