import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';
import {
	callGrafanaDashboardApi,
	createGrafanaDashboardPayload,
	createGrafanaFolder,
	fetchPanels
} from '$lib/utils/grafanaHandler';
import {
	createDashboardQuery,
	generatePanelFormJSON,
	generateTags,
	getUidAndSlug,
	queryExistingDashboard,
	validateForm
} from '$lib/utils/dashboardHandler';
import { initThumbnailsAndPaths, updateAllThumbnails } from '$lib/utils/thumbnailHandler';
import { fail, redirect } from '@sveltejs/kit';
import { error } from 'console';
export const load: PageServerLoad = async ({ url }) => {
	return {
		dashboard: await prisma.dashboard.findUniqueOrThrow({
			where: {
				id: url.pathname.split('/')[3]
			},
			include: {
				user: true,
				panels: true
	
			}
		}),
		predefinedPanels: fetchPanels()
	};
};

export const actions: Actions = {
	saveDashboard: async ({ request, locals }) => {
		const session = await locals.getSession();

		const {
			dashboardName,
			dashboardDescription,
			colCount,
			tags,
			published,
			panelForm,
			dashboardId
		} = Object.fromEntries(await request.formData()) as unknown as {
			dashboardName: string;
			dashboardDescription: string;
			colCount: number;
			tags: string;
			published: string;
			panelForm: string;
			dashboardId: string;
		};

		validateForm(dashboardName, colCount, published);

		const tagsList = generateTags(tags);

		let panelFormJSON = generatePanelFormJSON(panelForm, colCount);

		const { dashboardExists, user } = await queryExistingDashboard(session, dashboardId);

		if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
			return error(403, 'You are not allowed to copy this dashboard');
		}

		await createGrafanaFolder(user);

		const grafanaObject = await createGrafanaDashboardPayload(
			panelFormJSON,
			dashboardName,
			tagsList,
			user.id
		);
		const resp = await callGrafanaDashboardApi(JSON.stringify(grafanaObject));
		if (resp.status === 'success') {
			const uidAndSlug = getUidAndSlug(resp);

			const thumbnailPath = await initThumbnailsAndPaths(panelFormJSON, resp);

			await createDashboardQuery(
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

			 await updateAllThumbnails(uidAndSlug, panelFormJSON);

			throw redirect(301, `/p/view/${resp.uid}`);

		} else {
			return fail(422, {
				description: resp.message,
				error: resp.status
			});
		}
	}
};
