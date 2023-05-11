import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';
import { deleteDashboardAction } from '$lib/utils/formActions';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	return {
		dashboards: await prisma.dashboard.findMany({
			where: {
				userId: session?.user.id
			},
			include: {
				user: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		}),
		tags: await prisma.dashboard.findMany({
			where: {
				userId: session?.user.id
			},
			select: {
				tags: true
			}
		})
	};
};

export const actions: Actions = {
	deleteDashboard: async ({ request, locals }) => await deleteDashboardAction(request, locals)
};
