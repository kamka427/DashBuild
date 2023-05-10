import {
	upsertDashboardQuery,
	generatePanelFormJSON,
	generateTags,
	getUidAndSlug,
	queryExistingDashboard
} from './dashboardHandler';
import {
	callGrafanaDashboardApi,
	createGrafanaDashboardPayload,
	createGrafanaFolder,
	deleteDashboardOnGrafana
} from './grafanaHandler';
import { initThumbnailsAndPaths, updateAllThumbnails } from './thumbnailHandler';
import { redirect, fail, error } from '@sveltejs/kit';
import { permissionCheck, validateForm, validatePublish } from './validators';
import { prisma } from './prisma';

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

	const { title, description, colCount, tags, published, panelForm } = Object.fromEntries(
		await request.formData()
	) as unknown as {
		title: string;
		description: string;
		colCount: number;
		tags: string;
		published: string;
		panelForm: string;
	};

	title.trim();
	description.trim();
	tags.trim();
	const tagsList = generateTags(tags);
	const panelFormJSON = generatePanelFormJSON(panelForm, colCount);

	const isInvalid = await validateForm(
		title,
		description,
		colCount,
		published,
		tagsList,
		panelFormJSON
	);
	if (isInvalid) {
		return isInvalid;
	}

	const dashboardId = url.pathname.split('/')[3];

	const { dashboardExists, user } = await queryExistingDashboard(session, dashboardId);

	if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
		return error(403, 'You are not allowed to copy this dashboard');
	}

	await createGrafanaFolder(user);

	const grafanaObject = await createGrafanaDashboardPayload(
		panelFormJSON,
		title,
		description,
		tagsList,
		user.id,
		url.pathname.split('/')[2] === 'edit' ? dashboardExists : undefined
	);
	const resp = await callGrafanaDashboardApi(JSON.stringify(grafanaObject));
	if (resp.status === 'success') {
		const uidAndSlug = getUidAndSlug(resp);

		const thumbnailPath = await initThumbnailsAndPaths(panelFormJSON, resp);

		await upsertDashboardQuery(
			resp,
			title,
			description,
			published,
			tags,
			thumbnailPath,
			grafanaObject,
			colCount,
			user,
			panelFormJSON
		);

		await updateAllThumbnails(uidAndSlug, panelFormJSON);

		throw redirect(302, `/p/view/${resp.uid}`);
	} else {
		return fail(422, {
			description: "Couldn't save dashboard",
			error: resp.message
		});
	}
}

export async function deleteDashboardAction(
	request: {
		formData: () =>
			| Iterable<readonly [PropertyKey, any]>
			| PromiseLike<Iterable<readonly [PropertyKey, any]>>;
	},
	locals: { getSession: () => any }
) {
	const { dashboardId } = Object.fromEntries(await request.formData()) as unknown as {
		dashboardId: string;
	};

	await permissionCheck(locals, dashboardId, "You don't have permission to delete this dashboard");

	try {
		await prisma.dashboard.delete({
			where: {
				id: dashboardId
			}
		});

		const resp = deleteDashboardOnGrafana(dashboardId);
		console.log(resp);

		return {
			status: 200,
			body: {
				message: 'Dashboard deleted'
			}
		};
	} catch (error) {
		return fail(404, { message: 'Could not delete dashboard' });
	}
}

export async function refreshThumbnailsAction(url: { pathname: string }) {
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
		return {
			status: 500,
			body: {
				message: 'Could not refresh thumbnails'
			}
		};
	}

	return {
		status: 200,
		body: {
			message: 'Thumbnails refreshed'
		}
	};
}

export async function publishDashboardAction(
	request: {
		formData: () =>
			| Iterable<readonly [PropertyKey, any]>
			| PromiseLike<Iterable<readonly [PropertyKey, any]>>;
	},
	locals: App.Locals
) {
	const { dashboardId, publishState } = Object.fromEntries(await request.formData()) as unknown as {
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
