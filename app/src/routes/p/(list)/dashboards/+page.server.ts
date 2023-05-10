import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { deleteDashboardOnGrafana } from '$lib/utils/grafanaHandler';
import { permissionCheck } from '$lib/utils/validators';
import { deleteDashboardAction } from '$lib/utils/actions';

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
