import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	return {
		panels: prisma.panel.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				preview: true,
				representation: true
			},
			orderBy: {
				name: 'asc'
			}
		})
	};
};
