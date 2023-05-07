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
	generateDashboardThumbnail,
	updatePanelThumbnailsWithApi
} from '$lib/utils/thumbnailHandler';

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
		const thumbnailPath = generateDashboardThumbnail(panelFormJSON, dashboardName);
		panelFormJSON = panelFormJSON.map((panel) => {
			return {
				...panel,
				grafanaJSON: {
					...panel.grafanaJSON,
					gridPos: calculateGridPos(panel, Number(colCount))
				}
			};
		});

		const session = await event.locals.getSession();

		console.log(session?.user);

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

			updatePanelThumbnailsWithApi(uidAndSlug, 1);

			console.log(thumbnailPath);

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
					grafanaUrl: resp.url,
					version: resp.version,
					userId: user.id,
					panels: {
						create: panelFormJSON.map((panelElem: Panel) => ({
							panel: {
								create: {
									id: `${resp.uid}-${panelElem.id}`,
									name: panelElem.name,
									description: panelElem.description,
									thumbnailPath: panelElem.thumbnailPath,
									grafanaJSON: panelElem.grafanaJSON,
									pythonCode: panelElem.pythonCode,
									grafanaUrl: `${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
									width: panelElem.width
								}
							}
						}))
					}
				}
			});
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
