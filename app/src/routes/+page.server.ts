import type { PageServerLoad } from './$types';
import { prisma } from '$lib/utils/prisma';

export const load: PageServerLoad = async () => {
	return {
		dashboards: await prisma.dashboard.findMany({
			where: {
				published: true
			}
		})
	};
};
