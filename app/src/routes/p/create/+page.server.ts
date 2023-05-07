import type { PageServerLoad, Actions } from './$types';
import type { Panel } from '@prisma/client';
import { prisma } from '$lib/utils/prisma';
import { fail } from '@sveltejs/kit';
import {
	fetchPanels,
	createGrafanaPayload,
	calculateGridPos,
	callGrafanaApi
} from '$lib/utils/grafanaHandler';
import {
	copyDefaultThumbnail,
	generateDashboardThumbnail,
	updateAllThumbnails,
	updatePanelThumbnailsWithApi
} from '$lib/utils/thumbnailHandler';
import { GRAFANA_URL, THUMBNAIL_PATH } from '$env/static/private';

export const load: PageServerLoad = async () => {
	return {
		panels: prisma.panel.findMany({
			orderBy: {
				name: 'asc'
			}
		}),
		predefinedPanels: fetchPanels()
	};
};

export const actions: Actions = {
	saveDashboard: async (event) => {
		const { dashboardName, dashboardDescription, colCount, tags, published, panelForm } =
			Object.fromEntries(await event.request.formData()) as unknown as {
				dashboardName: string;
				dashboardDescription: string;
				colCount: number;
				tags: string;
				teamName: string;
				published: boolean;
				panelForm: string;
			};

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

		const session = await event.locals.getSession();

		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: session?.user?.email as string
			}
		});
		
		const tagsList = tags.split(',').map((tag) => tag.trim());
		const grafanaObject = await createGrafanaPayload(panelFormJSON, dashboardName, tagsList);
		const resp = await callGrafanaApi(JSON.stringify(grafanaObject));
		if (resp.status === 'success') {
			const uidAndSlug = resp.uid + '/' + resp.slug;
			
			const thumbnailPath = await generateDashboardThumbnail(panelFormJSON, resp.uid);
			panelFormJSON.map(async (panel: Panel) => {
				await copyDefaultThumbnail(resp.uid, panel.id, 'statPanel');
				panel.thumbnailPath = `${THUMBNAIL_PATH}/${resp.uid}_${panel.id}.png`;
				return panel;
			});

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
									width: panelElem.width
								}
							}
						}))
					}
				}
			});

			

			updateAllThumbnails(uidAndSlug, panelFormJSON);


		} else {
			fail(500, { message: 'Grafana API call failed' });
		}

		return {
			status: 200,
			body: {
				message: 'Dashboard saved'
			}
		};
	}
};
