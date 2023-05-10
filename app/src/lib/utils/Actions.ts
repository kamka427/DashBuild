import {
	createDashboardQuery,
	generatePanelFormJSON,
	generateTags,
	getUidAndSlug,
	queryExistingDashboard,
	validateForm
} from './dashboardHandler';
import {
	callGrafanaDashboardApi,
	createGrafanaDashboardPayload,
	createGrafanaFolder
} from './grafanaHandler';
import { initThumbnailsAndPaths, updateAllThumbnails } from './thumbnailHandler';
import { redirect, fail, error } from '@sveltejs/kit';

export async function saveDashboardAction(
	request: {
		formData: () =>
			| Iterable<readonly [PropertyKey, any]>
			| PromiseLike<Iterable<readonly [PropertyKey, any]>>;
	},
	locals: { getSession: () => any },
	url: { pathname: string } = { pathname: '' }
) {
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

	const dashboardId = url.pathname.split('/')[3];


	const { dashboardExists, user } = await queryExistingDashboard(session, dashboardId);

	if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
		return error(403, 'You are not allowed to copy this dashboard');
	}

	await createGrafanaFolder(user);

	const grafanaObject = await createGrafanaDashboardPayload(
		panelFormJSON,
		dashboardName,
		tagsList,
		user.id,
        url.pathname.split('/')[2] === 'edit' ? dashboardExists : undefined
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
