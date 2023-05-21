import { calculateGridPos } from './grafanaHandler';
import type { Panel, User } from '@prisma/client';
import { GRAFANA_URL } from '$env/static/private';
import { prisma } from './prisma';

export function generateTags(tags: string) {
	return tags.split(',').map((tag) => tag.trim());
}

export function generatePanelFormJSON(panelForm: string, colCount: number) {
	let panelFormJSON = JSON.parse(panelForm);
	console.log(panelFormJSON);
	panelFormJSON = panelFormJSON.map(
		(panel: Panel & { grafanaJSON: any; id: any }, index: number) => {
			panel.position = index + 1;
			panel.id = index + 1;
			return {
				...panel,
				grafanaJSON: {
					...panel.grafanaJSON,
					gridPos: calculateGridPos(panel, Number(colCount)),
					id: index + 1
				}
			};
		}
	);
	return panelFormJSON;
}
export async function upsertDashboardQuery(
	resp: { uid: string; url: string; version: number },
	dashboardName: string,
	dashboardDescription: string,
	published: string,
	tags: string,
	grafanaObject: object,
	colCount: number,
	user: User,
	panelList: any
) {
	const parsedPublished = published === 'true' ? true : false;

	await prisma.dashboard.upsert({
		where: {
			id: resp.uid
		},
		create: {
			id: resp.uid,
			name: dashboardName,
			description: dashboardDescription,
			published: parsedPublished,
			tags: tags,
			thumbnailPath: `/thumbnails/${resp.uid}_dashboard.png`,
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
				create: panelList.map((panelElem: Panel) => ({
					id: `${resp.uid}-${panelElem.position}`,
					name: panelElem.name,
					description: panelElem.description,
					thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
					grafanaJSON: panelElem.grafanaJSON,
					grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
					width: panelElem.width,
					position: panelElem.position,
					type: panelElem.type,
					properties: panelElem.properties
				}))
			}
		},
		update: {
			id: resp.uid,
			name: dashboardName,
			description: dashboardDescription,
			published: Boolean(published),
			tags: tags,
			thumbnailPath: `/thumbnails/${resp.uid}_dashboard.png`,
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
						notIn: panelList.map((panelElem: Panel) => `${resp.uid}-${panelElem.position}`)
					}
				},
				upsert: panelList.map((panelElem: Panel) => ({
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
						position: panelElem.position,
						type: panelElem.type,
						properties: panelElem.properties
					},
					update: {
						id: `${resp.uid}-${panelElem.position}`,
						name: panelElem.name,
						description: panelElem.description,
						thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
						grafanaJSON: panelElem.grafanaJSON,
						grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
						width: panelElem.width,
						position: panelElem.position,
						type: panelElem.type,
						properties: panelElem.properties
					}
				}))
			}
		}
	});
}

export function getUidAndSlug(resp: { uid: string; slug: string }) {
	return resp.uid + '/' + resp.slug;
}

export async function queryExistingDashboard(
	sessionUser: string,
	dashboardId: string | null = null
) {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: sessionUser
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
