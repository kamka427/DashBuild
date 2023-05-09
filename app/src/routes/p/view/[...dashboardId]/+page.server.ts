import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';
import { updateAllThumbnails } from '$lib/utils/thumbnailHandler';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	const dashboard = await prisma.dashboard.findUniqueOrThrow({
		where: {
			id: url.pathname.split('/')[3]
		},
		include: {
			user: true,
			panels: {
				include: {
					panel: true
				}
			},
			dashboardIterations: {
				include: {
					dashboard: true
				},
			}

		}
	});

	if (!dashboard.published && dashboard.userId !== session?.user.id) {
		throw redirect(300, '/p/gallery');
	}
	return { dashboard };
};

export const actions: Actions = {
	refreshThumbnails: async ({ url }) => {
		console.log('refreshing thumbnails');
		const uid = url.pathname.split('/')[3];
		const dashboard = await prisma.dashboard.findUniqueOrThrow({
			where: {
				id: uid
			},
			include: {
				panels: {
					include: {
						panel: true
					}
				}
			}
		});

		const uidAndSlug = `${uid}/${dashboard.name}`;

		const panelList = dashboard.panels
			.map((panel) => panel.panel)
			.sort((a, b) => a.position - b.position);

		await updateAllThumbnails(uidAndSlug, panelList);

		return {
			status: 200,
			body: {
				message: 'Thumbnails refreshed'
			}
		};
	},
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
