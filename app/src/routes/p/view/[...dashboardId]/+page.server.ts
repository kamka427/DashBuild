import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { updateAllThumbnails } from '$lib/utils/thumbnailHandler';
import { permissionCheck, validatePublish } from '$lib/utils/validators';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	const dashboard = await prisma.dashboard.findUniqueOrThrow({
		where: {
			id: url.pathname.split('/')[3]
		},
		include: {
			user: true,
			panels: true,
			dashboardIterations: {
				include: {
					dashboard: true
				}
			}
		}
	});

	if (!dashboard.published && dashboard.user.id !== session.user.id) {
		throw error(403, 'You do not have permission to view this dashboard');
	}
	return {
		dashboard
	};
};

export const actions: Actions = {
	refreshThumbnails: async ({ url }) => {
		const uid = url.pathname.split('/')[3];
		const dashboard = await prisma.dashboard.findUniqueOrThrow({
			where: {
				id: uid
			},
			include: {
				panels: true
			}
		});

		const uidAndSlug = `${uid}/${dashboard.name}`;

		const panelList = dashboard.panels.sort((a, b) => a.position - b.position);

		try {
			await updateAllThumbnails(uidAndSlug, panelList);
		} catch (error) {
			console.log(error);
			return fail(404, { message: 'Could not refresh thumbnails' });
		}

		return {
			status: 200,
			body: {
				message: 'Thumbnails refreshed'
			}
		};
	},
	publishDashboard: async ({ request, locals }) => {
		const { dashboardId, publishState } = Object.fromEntries(
			await request.formData()
		) as unknown as {
			dashboardId: string;
			publishState: string;
		};

		await permissionCheck(locals, dashboardId, 'You are not allowed to publish this dashboard');

		validatePublish(dashboardId, publishState);

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
			return fail(400, { message: 'Could not publish dashboard' });
		}
	}
};
