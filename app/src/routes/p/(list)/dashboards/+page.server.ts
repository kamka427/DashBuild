import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { deleteDashboardOnGrafana } from '$lib/utils/grafanaHandler';

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
				name: 'asc'
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
	deleteDashboard: async (event) => {
		const { dashboardId } = (await Object.fromEntries(
			await event.request.formData()
		)) as unknown as {
			dashboardId: string;
		};

		try {
			await prisma.dashboard.delete({
				where: {
					id: dashboardId
				}
			});

			console.log(dashboardId)
			const resp = deleteDashboardOnGrafana(dashboardId);
			console.log(resp);

			return {
				status: 200,
				body: {
					message: 'Dashboard deleted'
				}
			};
		} catch (error) {
			return fail(500, { message: 'Could not delete dashboard' });
		}
	}
};
