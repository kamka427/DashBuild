import { GRAFANA_URL, GRAFANA_API_TOKEN, PANEL_PARSER_URL } from '$env/static/private';
import dashboardTemplate from '$lib/configs/dashboardTemplate.json';
import type { Panel } from '@prisma/client';
import { type } from 'os';

export async function fetchPanels() {
	const resp = await fetch(`${PANEL_PARSER_URL}`);

	const data = await resp.json();

	type responsePanel = {
		file_name: string;
		json_data: {
			title: string;
		};
	};

	type panelEntry = {
		title: string;
		JSON: responsePanel['json_data'];
		thumbnailPath: string;
	};

	const panels: panelEntry[] = [];

	data.map((panel: responsePanel) => {
		panels.push({
			title: panel.json_data.title,
			JSON: panel.json_data,
			thumbnailPath: `../src/lib/thumbnails/${panel.file_name}.png`
		});
	});

	return panels;
}

export function calculateGridPos(
	panel: Panel & { grafanaJSON: any },

	colCount: number
) {
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

export async function createGrafanaPayload(
	panelForm: Panel[],
	dashboardName: string,
	tags: string[]
) {
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

export async function callGrafanaApi(grafanaJSON: string) {
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
