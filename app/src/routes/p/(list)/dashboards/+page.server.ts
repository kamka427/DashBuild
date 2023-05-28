import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';
import { deleteDashboardAction } from '$lib/utils/formActions';

/**
 * Loads the dashboard data for the dashboard page.
 * @param locals - The SvelteKit locals object.
 * @returns An object containing the dashboards and tags.
 */
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

/**
 * Defines the actions that can be performed on the dashboard page.
 */
export const actions: Actions = {
	/**
	 * Deletes the dashboard data.
	 * @param request - The HTTP request.
	 * @param locals - The SvelteKit locals object.
	 * @returns The result of the deleteDashboardAction function.
	 */
	deleteDashboard: async ({ request, locals }) => await deleteDashboardAction(request, locals)
};
