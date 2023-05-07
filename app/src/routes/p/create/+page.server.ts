import type { PageServerLoad, Actions } from './$types';
import type { Panel } from '@prisma/client';
import { GRAFANA_URL, GRAFANA_API_TOKEN, PANEL_PARSER_URL } from '$env/static/private';
import path from 'path';
import { prisma } from '$lib/prisma';
import sharp from 'sharp';
import dashboardTemplate from '$lib/configs/dashboardTemplate.json';
import { fail } from '@sveltejs/kit';
import fs from 'fs';

async function fetchPanels() {
	const resp = await fetch(`${PANEL_PARSER_URL}`);

	const data = await resp.json();

	type responsePanel = {
		title: string;
		JSON: any;
		thumbnailPath: string;
	};

	const panels: responsePanel[] = [];

	// key is title and value is JSON
	data.map((panel: responsePanel) => {
		panels.push({
			title: panel.json_data.title,
			JSON: panel.json_data,
			thumbnailPath: `../src/lib/thumbnails/${panel.file_name}.png`
		});
	});

	return panels;
}

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

function generateDashboardThumbnail(panelList, dashboardName) {
	const locations = {
		'0': 'northwest',
		'1': 'northeast',
		'2': 'southwest',
		'3': 'southeast'
	};

	const firstFourPanels = panelList.slice(0, 4);
	const inputs = firstFourPanels.map((panel, index) => {
		return {
			input: `${path.resolve('app', panel.thumbnailPath)}`,
			gravity: locations[index]
		};
	});

	sharp({
		create: {
			width: 1600,
			height: 600,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`${path.resolve('app', '../src/lib/thumbnails')}/${dashboardName}.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
		});

	return `../src/lib/thumbnails/${dashboardName}.png`;
}

function calculateGridPos(panel: Panel, colCount: number) {
	let gridPos = {
		h: 9,
		w: 24 / colCount,
		x: 0,
		y: 0
	};

	let panelIndex = parseInt(panel.id);

	let row = Math.floor(panelIndex / colCount);
	let col = panelIndex % colCount;

	gridPos.x = col * gridPos.w;
	gridPos.y = row * gridPos.h;

	panel.grafanaJSON.gridPos = gridPos;

	return gridPos;
}

async function createGrafanaPayload(panelForm: Panel[], dashboardName: string, tags: string[]) {
	let grafanaObject = {
		dashboard: {
			...dashboardTemplate,
			title: dashboardName,
			panels: panelForm.map((panel) => panel.grafanaJSON),
			tags: tags
		}
	};

	return grafanaObject;
}

async function callGrafanaApi(grafanaJSON: string) {
	const response = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: GRAFANA_API_TOKEN
		},
		body: grafanaJSON
	});

	const resp = await response.json();
	console.log(resp);
	return resp;
}
import { promisify } from 'util';
const writeFilePromise = promisify(fs.writeFile);

async function updatePanelThumbnailsWithApi(uuidAndSlug: string, panelId: string) {
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uuidAndSlug}?orgId=1&from=1683393012358&to=1683414612358&panelId=${panelId}&width=500&height=250&tz=Europe%2FBudapest`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
		}
	);

	const buffer = await response.arrayBuffer();

	const resp = await sharp(buffer).jpeg().toBuffer();
	await writeFilePromise(`${path.resolve('app', '../src/lib/thumbnails')}/${panelId}.png`, buff);

	return response;
}

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
