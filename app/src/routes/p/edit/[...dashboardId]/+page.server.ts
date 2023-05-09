import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';
import {
	callGrafanaDashboardApi,
	createGrafanaDashboardPayload,
	fetchPanels
} from '$lib/utils/grafanaHandler';
import {
	createGrafanaFolder,
	createGrafanaObject,
	generatePanelFormJSON,
	generateTags,
	getUidAndSlug,
	iterateThumbnailPaths,
	queryExistingDashboard,
	updateDashboardQuery,
	upsertDashboardQuery,
	validateForm
} from '$lib/utils/dashboardHandler';
import { updateAllThumbnails } from '$lib/utils/thumbnailHandler';
import { fail, redirect } from '@sveltejs/kit';
import { error } from 'console';
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
		}),
		predefinedPanels: fetchPanels()
	};
};

export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) => {
		const session = await locals.getSession();

		const {
			dashboardName,
			dashboardDescription,
			colCount,
			tags,
			published,
			panelForm,
		} = Object.fromEntries(await request.formData()) as unknown as {
			dashboardName: string;
			dashboardDescription: string;
			colCount: number;
			tags: string;
			published: string;
			panelForm: string;
		};

		validateForm(dashboardName, colCount, published);

		const tagsList = generateTags(tags);

		let panelFormJSON = generatePanelFormJSON(panelForm, colCount);

		const dashboardId = url.pathname.split('/')[3];

		const { dashboardExists, user } = await queryExistingDashboard(session, dashboardId);

		if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
			return error(403, 'You are not allowed to edit this dashboard');
		}


		await createGrafanaFolder(user);

		const grafanaObject = await createGrafanaDashboardPayload(
			panelFormJSON,
			dashboardName,
			tagsList,
			user.id,
			dashboardExists
		);

		const resp = await callGrafanaDashboardApi(JSON.stringify(grafanaObject));
		if (resp.status === 'success') {
			const uidAndSlug = getUidAndSlug(resp);

			const thumbnailPath = await iterateThumbnailPaths(panelFormJSON, resp);

			await updateDashboardQuery(
				resp,
				dashboardName,
				dashboardDescription,
				published,
				tags,
				thumbnailPath,
				grafanaObject,
				colCount,
				user,
				panelFormJSON
			);

			// await updateAllThumbnails(uidAndSlug, panelFormJSON);

			throw redirect(301, `/p/view/${resp.uid}`);

			return {
				status: 200,
				body: {
					message: 'Dashboard saved'
				}
			};
		} else {
			return fail(422, {
				description: resp.message,
				error: resp.status
			});
		}
	}
};
