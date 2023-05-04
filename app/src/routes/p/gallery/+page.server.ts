import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
