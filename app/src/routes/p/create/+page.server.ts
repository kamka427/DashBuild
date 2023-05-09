import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/utils/prisma';
import { fail, redirect } from '@sveltejs/kit';
import {
	fetchPanels,
	callGrafanaDashboardApi,
	createGrafanaDashboardPayload
} from '$lib/utils/grafanaHandler';
import { updateAllThumbnails } from '$lib/utils/thumbnailHandler';
import {
	createDashboardQuery,
	createGrafanaFolder,
	generatePanelFormJSON,
	generateTags,
	getUidAndSlug,
	iterateThumbnailPaths,
	queryExistingDashboard,
	validateForm
} from '$lib/utils/dashboardHandler';

export const load: PageServerLoad = async () => {
	return {

		predefinedPanels: fetchPanels()
	};
};

export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) => {
		const session = await locals.getSession();

		const { dashboardName, dashboardDescription, colCount, tags, published, panelForm } =
			Object.fromEntries(await request.formData()) as unknown as {
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

		const { user } = await queryExistingDashboard(session);

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

			const thumbnailPath = await iterateThumbnailPaths(panelFormJSON, resp);

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
