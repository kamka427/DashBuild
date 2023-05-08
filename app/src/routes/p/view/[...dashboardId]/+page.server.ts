import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	const dashboard = prisma.dashboard.findUniqueOrThrow({
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
	});

	if (!(await dashboard).published && dashboard.userId !== session?.user.id) {
		throw redirect(300, '/p/gallery');
	}
	return { dashboard };
};

export const actions: Actions = {
	publishDashboard: async (event) => {
		const { dashboardId, publishState } = (await Object.fromEntries(
			await event.request.formData()
		)) as unknown as {
			dashboardId: string;
			publishState: string;
		};
		try {
			await prisma.dashboard.update({
				where: {
					id: dashboardId
				},
				data: {
					published: publishState === 'true' ? true : false
				}
			});

			return {
				status: 200,
				body: {
					message: 'Dashboard published'
				},
				headers: {
					location: '/p/dashboards'
				}
			};
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'Could not publish dashboard' });
		}
	}
};
