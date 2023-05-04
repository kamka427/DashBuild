import type { PageServerLoad, Actions } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
