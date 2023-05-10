import { fail } from '@sveltejs/kit';
import {
	calculateGridPos,
} from './grafanaHandler';
import type { Panel, User } from '@prisma/client';
import { GRAFANA_URL } from '$env/static/private';
import { prisma } from './prisma';

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
			dashboardIterations: {
				create: {
					id: `${resp.uid}-${resp.version}`,
					version: resp.version,
					grafanaJSON: grafanaObject
				}
			},
			userId: user.id,
			panels: {
				create: panelFormJSON.map((panelElem: Panel) => ({
					id: `${resp.uid}-${panelElem.position}`,
					name: panelElem.name,
					description: panelElem.description,
					thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
					grafanaJSON: panelElem.grafanaJSON,
					grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
					width: panelElem.width,
					position: panelElem.position
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
			dashboardIterations: {
				create: {
					id: `${resp.uid}-${resp.version}`,
					version: resp.version,
					grafanaJSON: grafanaObject
				}
			},
			userId: user.id,
			panels: {
				deleteMany: {
					id: {
						notIn: panelFormJSON.map((panelElem: Panel) => `${resp.uid}-${panelElem.position}`)
					}
				},
				upsert: panelFormJSON.map((panelElem: Panel) => ({
					where: {
						id: `${resp.uid}-${panelElem.position}`
					},
					create: {
						id: `${resp.uid}-${panelElem.position}`,
						name: panelElem.name,
						description: panelElem.description,
						thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
						grafanaJSON: panelElem.grafanaJSON,
						grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
						width: panelElem.width,
						position: panelElem.position
					},
					update: {
						id: `${resp.uid}-${panelElem.position}`,
						name: panelElem.name,
						description: panelElem.description,
						thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
						grafanaJSON: panelElem.grafanaJSON,
						grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
						width: panelElem.width,
						position: panelElem.position
					}
				}))
			}
		}
	});
}

export function getUidAndSlug(resp: any) {
	return resp.uid + '/' + resp.slug;
}

export async function queryExistingDashboard(session: any, dashboardId: string | null = null) {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: session?.user.id as string
		},
		include: {
			dashboards: true
		}
	});

	if (dashboardId !== null) {
		const dashboardExists = await prisma.dashboard.findFirst({
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
