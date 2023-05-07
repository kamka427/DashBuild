import type { PageServerLoad } from './$types';
import { prisma } from '$lib/utils/prisma';

export const load: PageServerLoad = async () => {
	return {
		dashboards: prisma.dashboard.findMany({
			include: {
				user: true
			},
			where: {
				published: true
			}
		}),
		teams: prisma.user.findMany({
			select: {
				team: true
			}
		}),
		tags: prisma.dashboard.findMany({
			select: {
				tags: true
			}
		})
	};
};
