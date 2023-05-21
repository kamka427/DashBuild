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
import { redirect, fail, error as svelteError } from '@sveltejs/kit';
import { permissionCheck, validateForm, validatePublish } from './validators';
import { prisma } from './prisma';
import { IMAGE_RENDERER } from '$env/static/private';

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
	const panelList = generatePanelFormJSON(panelForm, colCount);

	const isInvalid = await validateForm(
		title,
		description,
		colCount,
		published,
		tagsList,
		panelList
	);
	if (isInvalid) {
		return isInvalid;
	}

	const uid = url.pathname.split('/')[3];
	const userId = session.user.id;
	const { dashboardExists, user } = await queryExistingDashboard(userId, uid);

	if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
		return fail(403, {
			message: 'You do not have permission to edit this dashboard'
		});
	}

	if (user.dashboards.length === 0) {
		await createGrafanaFolder(user);
	}

	const method = url.pathname.split('/')[2];

	const grafanaObject = await createGrafanaDashboardPayload(
		panelList,
		title,
		description,
		tagsList,
		user.id,
		method === 'edit' ? dashboardExists : undefined
	);
	const resp = await callGrafanaDashboardApi(JSON.stringify(grafanaObject));
	if (resp.status === 'success') {
		const uidAndSlug = getUidAndSlug(resp);

		try {
			await initThumbnailsAndPaths(resp.uid, panelList);
		} catch (error) {
			console.log(error);
			return svelteError(500, 'Could not initialize thumbnails');
		}

		await upsertDashboardQuery(
			resp,
			title,
			description,
			published,
			tags,
			grafanaObject,
			colCount,
			user,
			panelList
		);

		if (IMAGE_RENDERER === 'true') {
			try {
				await updateAllThumbnails(uidAndSlug, panelList);
			} catch (error) {
				console.log(error);
				fail(500, {
					message: 'Could not update thumbnails'
				});
			}
		}

		throw redirect(302, `/p/view/${resp.uid}`);
	} else {
		return fail(403, {
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

		await deleteDashboardOnGrafana(dashboardId);

		return { status: 200 };
	} catch (error) {
		console.log(error);
		fail(500, {
			message: 'Could not delete dashboard'
		});
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
		if (IMAGE_RENDERER === 'true') {
			await updateAllThumbnails(uidAndSlug, panelList);
		} else {
			await initThumbnailsAndPaths(uid, panelList);
		}
	} catch (error) {
		console.log(error);
		return fail(500, {
			message: 'Could not update thumbnails'
		});
	}

	return { status: 200 };
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
	} catch (error) {
		return fail(404, { message: 'Could not publish dashboard' });
	}

	return { status: 200 };
}
