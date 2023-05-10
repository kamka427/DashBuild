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
			panels: true,
			dashboardIterations: {
				include: {
					dashboard: true
				}
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
				panels: true
			}
		});

		const uidAndSlug = `${uid}/${dashboard.name}`;

		const panelList = dashboard.panels
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
			console.log(error);
			return fail(500, { message: 'Could not publish dashboard' });
		}
	}
};

async function validatePublish(dashboardId: string, publishState: string) {
	if (!dashboardId || !publishState) {
		return fail(400, { message: 'Missing dashboardId or publishState' });
	}

	if (publishState !== 'true' && publishState !== 'false') {
		return fail(400, { message: 'Invalid publishState' });
	}

	if (publishState === 'true') {
		const dashboard = await prisma.dashboard.findUnique({
			where: {
				id: dashboardId
			}
		});

		if (!dashboard) {
			return fail(404, { message: 'Dashboard not found' });
		}

		if (dashboard.published) {
			return fail(400, { message: 'Dashboard already published' });
		}
	}
}
