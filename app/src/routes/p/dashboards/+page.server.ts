import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';

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
