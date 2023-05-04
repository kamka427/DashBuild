import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async () => {
	return {
		dashboards: prisma.dashboard.findMany({
			include: {
				user: true
			},
			orderBy: {
				name: 'asc'
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

export const actions: Actions = {
	publishDashboard: async ({ url }) => {
		const dashboardId = url.searchParams.get('dashboardId') as string;
		const publishState = url.searchParams.get('publishState') as string;
		try {
			await prisma.dashboard.update({
				where: {
					id: dashboardId
				},
				data: {
					published: publishState === 'true' ? true : false
				}
			});
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'Could not publish dashboard' });
		}
	},
	deleteDashboard: async ({ url }) => {
		const dashboardId = url.searchParams.get('dashboardId') as string;
		try {
			await prisma.dashboard.delete({
				where: {
					id: dashboardId
				}
			});
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'Could not delete dashboard' });
		}
	}
};
