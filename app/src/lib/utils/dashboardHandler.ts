import { fail } from '@sveltejs/kit';
import {
	calculateGridPos,
	callGrafanaFolderApi,
	createGrafanaFolderPayload
} from './grafanaHandler';
import type { Dashboard, Panel, User } from '@prisma/client';
import { GRAFANA_URL, THUMBNAIL_PATH } from '$env/static/private';
import { prisma } from './prisma';
import { copyDefaultThumbnail, generateDashboardThumbnail } from './thumbnailHandler';

export function validateForm(dashboardName: string, colCount: number, published: string) {
	if (dashboardName.length < 3 || dashboardName.length > 50) {
		return fail(422, {
			description: dashboardName,
			error: "The dashboard's name should be between 3 and 60 characters"
		});
	}

	if (colCount < 1 || colCount > 4) {
		return fail(422, {
			description: colCount,
			error: "The dashboard's column count should be between 1 and 4"
		});
	}

	if (published !== 'true' && published !== 'false') {
		console.log(published);
		return fail(422, { description: published, error: 'Published should be a boolean' });
	}
}

export function generateTags(tags: string) {
	return tags.split(',').map((tag) => tag.trim());
}

export function generatePanelFormJSON(panelForm: string, colCount: number) {
	let panelFormJSON = JSON.parse(panelForm);
	panelFormJSON = panelFormJSON.map((panel: Panel & { grafanaJSON: any }) => {
		return {
			...panel,
			grafanaJSON: {
				...panel.grafanaJSON,
				gridPos: calculateGridPos(panel, Number(colCount))
			}
		};
	});
	return panelFormJSON;
}

export async function createDashboardQuery(
	resp: any,
	dashboardName: string,
	dashboardDescription: string,
	published: string,
	tags: string,
	thumbnailPath: string,
	grafanaObject: {},
	colCount: number,
	user: User,
	panelFormJSON: any
) {
	await prisma.dashboard.create({
		data: {
			id: resp.uid,
			name: dashboardName,
			description: dashboardDescription,
			published: Boolean(published),
			tags: tags,
			thumbnailPath: thumbnailPath,
			grafanaJSON: grafanaObject,
			columns: Number(colCount),
			grafanaUrl: `${GRAFANA_URL}${resp.url}`,
			version: resp.version,
			userId: user.id,
			panels: {
				create: panelFormJSON.map((panelElem: Panel) => ({
					panel: {
						create: {
							id: `${resp.uid}-${panelElem.id}`,
							name: panelElem.name,
							description: panelElem.description,
							thumbnailPath: `${THUMBNAIL_PATH}/${resp.uid}_${panelElem.id}.png`,
							grafanaJSON: panelElem.grafanaJSON,
							grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
							width: panelElem.width,
							position: panelElem.position
						}
					}
				}))
			}
		}
	});
}

export async function updateDashboardQuery(
	resp: any,
	dashboardName: string,
	dashboardDescription: string,
	published: string,
	tags: string,
	thumbnailPath: string,
	grafanaObject: {},
	colCount: number,
	user: User,
	panelFormJSON: any
) {
	await prisma.dashboard.update({
		where: {
			id: resp.uid
		},
		data: {
			id: resp.uid,
			name: dashboardName,
			description: dashboardDescription,
			published: Boolean(published),
			tags: tags,
			thumbnailPath: thumbnailPath,
			grafanaJSON: grafanaObject,
			columns: Number(colCount),
			grafanaUrl: `${GRAFANA_URL}${resp.url}`,
			version: resp.version,
			userId: user.id,
			panels: {
				deleteMany: {},
				create: panelFormJSON.map((panelElem: Panel) => ({
					panel: {
						create: {
							id: `${resp.uid}-${panelElem.id}-${resp.version}`,
							name: panelElem.name,
							description: panelElem.description,
							thumbnailPath: `${THUMBNAIL_PATH}/${resp.uid}_${panelElem.id}.png`,
							grafanaJSON: panelElem.grafanaJSON,
							grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
							width: panelElem.width
						}
					}
				}))
			}
		}
	});
}

export async function iterateThumbnailPaths(panelFormJSON: any, resp: any) {
	const thumbnailPath = await generateDashboardThumbnail(panelFormJSON, resp.uid);
	panelFormJSON.map(async (panel: Panel) => {
		await copyDefaultThumbnail(resp.uid, panel.id, panel.thumbnailPath);
		panel.thumbnailPath = `${THUMBNAIL_PATH}/${resp.uid}_${panel.id}.png`;
		return panel;
	});
	return thumbnailPath;
}

export function getUidAndSlug(resp: any) {
	return resp.uid + '/' + resp.slug;
}

export async function createGrafanaFolder(user: User & { dashboards: Dashboard[] }) {
	if (user.dashboards.length === 0) {
		const folderObject = await createGrafanaFolderPayload(user.id);
		await callGrafanaFolderApi(JSON.stringify(folderObject));
	}
}

export async function queryExistingDashboard(session: any, dashboardId: string | null) {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: session?.user.id as string
		},
		include: {
			dashboards: true
		}
	});

	if (dashboardId !== null) {
		const dashboardExists = await prisma.dashboard.findFirstOrThrow({
			where: {
				userId: user.id,
				id: dashboardId
			},
			include: {
				panels: true
			}
		});
		return { dashboardExists, user };
	}
	return { dashboardExists: null, user };
}
