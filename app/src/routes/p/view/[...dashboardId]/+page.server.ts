import type { PageServerLoad, Actions } from './$types';
import { PrismaClient } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';

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
			throw redirect(301, '/dashboards');
		} catch (error) {
			return fail(500, { message: 'Could not delete dashboard' });
		}
	}
};
