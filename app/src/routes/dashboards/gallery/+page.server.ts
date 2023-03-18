import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	return {
		dashboards: prisma.dashboard.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				preview: true,
				tags: true,
				representation: true,
				user: {
					select: {
						id: true,
						name: true,
						team: true
					}
				}
			}
		})
	};
};
