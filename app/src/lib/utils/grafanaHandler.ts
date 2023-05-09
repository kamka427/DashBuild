import {
	GRAFANA_URL,
	GRAFANA_API_TOKEN,
	PANEL_PARSER_URL,
	THUMBNAIL_PATH
} from '$env/static/private';
import type { Dashboard, Panel } from '@prisma/client';

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
			thumbnailPath: `${THUMBNAIL_PATH}/${panel.file_name}.png`
		});
	});

	return panels;
}

export function calculateGridPos(
	panel: Panel & {
		grafanaJSON: {
			gridPos: {
				h: number;
				w: number;
				x: number;
				y: number;
			};
		};
	},

	colCount: number
) {
	const gridPos = {
		h: 9,
		w: 24 / colCount,
		x: 0,
		y: 0
	};

	const panelIndex = panel.position - 1;

	const row = Math.floor(panelIndex / colCount);
	const col = panelIndex % colCount;

	gridPos.x = col * gridPos.w;
	gridPos.y = row * gridPos.h;

	panel.grafanaJSON.gridPos = gridPos;

	return gridPos;
}

export async function createGrafanaDashboardPayload(
	panelForm: Panel[],
	dashboardName: string,
	tags: string[],
	userFolder: string,
	exitingDashboard: Dashboard | null = null
) {
	const grafanaObject = {
		dashboard: {
			title: dashboardName,
			panels: panelForm.map((panel) => panel.grafanaJSON),
			tags: tags,
			uid: exitingDashboard !== null ? exitingDashboard.id : null,
			version: exitingDashboard !== null ? exitingDashboard.version : null
		},
		folderUid: userFolder,
		overwrite: exitingDashboard !== null ? true : false
	};


	return grafanaObject;
}

export async function createGrafanaFolderPayload(folderName: string) {
	const grafanaObject = {
		uid: folderName,
		title: folderName
	};

	return grafanaObject;
}

export async function callGrafanaDashboardApi(grafanaJSON: string) {
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

export async function callGrafanaFolderApi(grafanaJSON: string) {
	const response = await fetch(`${GRAFANA_URL}/api/folders`, {
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
