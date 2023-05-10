import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { deleteDashboardOnGrafana } from '$lib/utils/grafanaHandler';
import { permissionCheck } from '$lib/utils/validators';

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
	deleteDashboard: async ({request, locals}) => {
		const { dashboardId } = (await Object.fromEntries(
			await request.formData()
		)) as unknown as {
			dashboardId: string;
		};

		await permissionCheck(locals, dashboardId, "You don't have permission to delete this dashboard");

		try {
			await prisma.dashboard.delete({
				where: {
					id: dashboardId
				}
			});

			console.log(dashboardId);
			const resp = deleteDashboardOnGrafana(dashboardId);
			console.log(resp);

			return {
				status: 200,
				body: {
					message: 'Dashboard deleted'
				}
			};
		} catch (error) {
			return fail(404, { message: 'Could not delete dashboard' });
		}
	}
};
