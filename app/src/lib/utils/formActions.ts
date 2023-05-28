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

/**
 * Saves a dashboard to Grafana and the database
 * @param request - The request object containing the form data
 * @param locals - The locals object containing the session data
 * @param url - The URL object containing the pathname
 * @returns A redirect to the dashboard view page or an error message
 */
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

	// Extract form data from request object
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

	// Trim whitespace from form data
	title.trim();
	description.trim();
	tags.trim();

	// Generate tags and panel list from form data
	const tagsList = generateTags(tags);
	const panelList = generatePanelFormJSON(panelForm, colCount);

	// Validate form data
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

	// Get dashboard ID from URL
	const uid = url.pathname.split('/')[3];

	// Get user ID from session
	const userId = session.user.id;

	// Check if dashboard already exists and if user has permission to edit it
	const { dashboardExists, user } = await queryExistingDashboard(userId, uid);
	if (dashboardExists && !dashboardExists.published && dashboardExists.userId !== user.id) {
		return fail(403, {
			message: 'You do not have permission to edit this dashboard'
		});
	}

	// Create Grafana folder if user has no dashboards
	if (user.dashboards.length === 0) {
		await createGrafanaFolder(user);
	}

	// Determine whether to create or update dashboard
	const method = url.pathname.split('/')[2];

	// Create Grafana dashboard payload
	const grafanaObject = await createGrafanaDashboardPayload(
		panelList,
		title,
		description,
		tagsList,
		user.id,
		method === 'edit' ? dashboardExists : undefined
	);

	// Call Grafana API to create or update dashboard
	const resp = await callGrafanaDashboardApi(JSON.stringify(grafanaObject));
	if (resp.status === 'success') {
		// Get UID and slug from response
		const uidAndSlug = getUidAndSlug(resp);

		// Initialize thumbnails and paths
		try {
			await initThumbnailsAndPaths(resp.uid, panelList);
		} catch (error) {
			console.log(error);
			return svelteError(500, 'Could not initialize thumbnails');
		}

		// Upsert dashboard to database
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

		// Update thumbnails if image renderer is enabled
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

		// Redirect to dashboard view page
		throw redirect(302, `/p/view/${resp.uid}`);
	} else {
		// Return error message if dashboard could not be saved
		return fail(403, {
			description: "Couldn't save dashboard",
			error: resp.message
		});
	}
}

/**
 * Deletes a dashboard from Grafana and the database
 * @param request - The request object containing the form data
 * @param locals - The locals object containing the session data
 * @returns A status code indicating success or an error message
 */
export async function deleteDashboardAction(
	request: {
		formData: () =>
			| Iterable<readonly [PropertyKey, any]>
			| PromiseLike<Iterable<readonly [PropertyKey, any]>>;
	},
	locals: { getSession: () => any }
) {
	// Extract dashboard ID from form data
	const { dashboardId } = Object.fromEntries(await request.formData()) as unknown as {
		dashboardId: string;
	};

	// Check if user has permission to delete dashboard
	await permissionCheck(locals, dashboardId, "You don't have permission to delete this dashboard");

	try {
		// Delete dashboard from database and Grafana
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

/**
 * Refreshes the thumbnails for a dashboard
 * @param url - The URL object containing the pathname
 * @returns A status code indicating success or an error message
 */
export async function refreshThumbnailsAction(url: { pathname: string }) {
	// Get dashboard ID from URL
	const uid = url.pathname.split('/')[3];

	// Get dashboard data from database
	const dashboard = await prisma.dashboard.findUniqueOrThrow({
		where: {
			id: uid
		},
		include: {
			panels: true
		}
	});

	// Generate UID and slug for dashboard
	const uidAndSlug = `${uid}/${dashboard.name}`;

	// Sort panels by position
	const panelList = dashboard.panels.sort((a, b) => a.position - b.position);

	try {
		// Update thumbnails if image renderer is enabled, otherwise initialize thumbnails and paths
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

/**
 * Publishes or unpublishes a dashboard
 * @param request - The request object containing the form data
 * @param locals - The locals object containing the session data
 * @returns A status code indicating success or an error message
 */
export async function publishDashboardAction(
	request: {
		formData: () =>
			| Iterable<readonly [PropertyKey, any]>
			| PromiseLike<Iterable<readonly [PropertyKey, any]>>;
	},
	locals: App.Locals
) {
	// Extract dashboard ID and publish state from form data
	const { dashboardId, publishState } = Object.fromEntries(await request.formData()) as unknown as {
		dashboardId: string;
		publishState: string;
	};

	// Check if user has permission to publish dashboard
	await permissionCheck(locals, dashboardId, 'You are not allowed to publish this dashboard');

	// Validate publish state
	validatePublish(dashboardId, publishState);

	try {
		// Update dashboard in database
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
