import type { PageServerLoad, Actions } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	return {
		dashboards: prisma.dashboard.findMany({
			where: {
				published: true
			}
		})
	};
};
