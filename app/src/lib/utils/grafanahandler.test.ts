import { fetchPanels } from './grafanaHandler';
import { describe, it, expect, vi } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';

vi.stubEnv('GRAFANA_URL', 'test');
vi.stubEnv('GRAFANA_API_TOKEN', 'test');

describe('fetchPanels', () => {
	it('should fetch panels from the panel parser API', async () => {
		const mockResponse = [
			{
				json_data: {
					title: 'Panel 1'
				},
				file_name: 'panel1',
				config: {}
			},
			{
				json_data: {
					title: 'Panel 2'
				},
				file_name: 'panel2',
				config: {}
			}
		];
		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue(mockResponse)
		});

		const result = await fetchPanels();

		expect(result).toEqual([
			{
				title: 'Panel 1',
				JSON: {
					title: 'Panel 1'
				},
				thumbnailPath: '/defaults/panel1.png',
				fileName: 'panel1',
				properties: {}
			},
			{
				title: 'Panel 2',
				JSON: {
					title: 'Panel 2'
				},
				thumbnailPath: '/defaults/panel2.png',
				fileName: 'panel2',
				properties: {}
			}
		]);
	});
});

import { calculateGridPos } from './grafanaHandler';

describe('calculateGridPos', () => {
	it('should calculate the correct grid position for a panel', () => {
		const panel = {
			position: 1,
			grafanaJSON: {
				gridPos: {
					h: 0,
					w: 0,
					x: 0,
					y: 0
				}
			},
			width: 1
		};
		const colCount = 2;

		const result = calculateGridPos(null, panel as any, colCount);

		expect(result).toEqual({
			h: 9,
			w: 12,
			x: 0,
			y: 0
		});
	});

	it('should calculate the correct grid position for a panel with a previous panel', () => {
		const prevPanel = {
			position: 1,
			grafanaJSON: {
				gridPos: {
					h: 9,
					w: 12,
					x: 0,
					y: 0
				}
			},
			width: 1
		};
		const panel = {
			position: 2,
			grafanaJSON: {
				gridPos: {
					h: 0,
					w: 0,
					x: 0,
					y: 0
				}
			},
			width: 1
		};
		const colCount = 2;

		const result = calculateGridPos(prevPanel as any, panel as any, colCount);

		expect(result).toEqual({
			h: 9,
			w: 12,
			x: 12,
			y: 0
		});
	});
});

import { createGrafanaDashboardPayload } from './grafanaHandler';
import type { Panel } from '@prisma/client';

describe('createGrafanaDashboardPayload', () => {
	it('should create a Grafana dashboard payload with the correct properties', async () => {
		const panelForm: Panel[] = [
			{
				id: 'abc123',
				name: 'Panel 1',
				description: null,
				thumbnailPath: '/thumbnails/panel1.png',
				grafanaJSON: {
					title: 'Panel 1',
					gridPos: {
						h: 9,
						w: 12,
						x: 0,
						y: 0
					}
				},
				grafanaUrl: 'http://localhost:3000/d/abc123/panel-1',
				width: 1,
				position: 1,
				type: 'timeseries',
				properties: {},
				dashboardId: 'abc123',
				createdAt: new Date('2021-08-04T15:00:00.000Z'),
				updatedAt: new Date('2021-08-04T15:00:00.000Z')
			}
		];
		const title = 'My Dashboard';
		const description = 'A dashboard for monitoring metrics';
		const tags = ['monitoring', 'metrics'];
		const userFolder = 'my-folder';

		const result = await createGrafanaDashboardPayload(
			panelForm,
			title,
			description,
			tags,
			userFolder
		);

		expect(result).toEqual({
			dashboard: {
				title: 'My Dashboard',
				description: 'A dashboard for monitoring metrics',
				panels: [
					{
						title: 'Panel 1',
						gridPos: {
							h: 9,
							w: 12,
							x: 0,
							y: 0
						}
					}
				],
				tags: ['monitoring', 'metrics'],
				uid: null,
				version: 1
			},
			folderUid: 'my-folder'
		});
	});
});

import { createGrafanaFolderPayload } from './grafanaHandler';

describe('createGrafanaFolderPayload', () => {
	it('should create a Grafana folder payload with the correct properties', async () => {
		const uid = 'abc123';
		const folderName = 'My Folder';

		const result = await createGrafanaFolderPayload(uid, folderName);

		expect(result).toEqual({
			uid: 'abc123',
			title: 'My Folder'
		});
	});
});

import { callGrafanaDashboardApi } from './grafanaHandler';

describe('callGrafanaDashboardApi', () => {
	it('should call the Grafana dashboard API with the correct parameters', async () => {
		const grafanaJSON = '{"dashboard":{"title":"My Dashboard","panels":[]}}';
		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue({ status: 'success' })
		} as any);

		const result = await callGrafanaDashboardApi(grafanaJSON);

		expect(global.fetch).toHaveBeenCalledWith(`${GRAFANA_URL}/api/dashboards/db`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			},
			body: grafanaJSON
		});
		expect(result).toEqual({ status: 'success' });
	});
});

import { deleteDashboardOnGrafana, callGrafanaFolderApi } from './grafanaHandler';

describe('deleteDashboardOnGrafana', () => {
	it('should call the Grafana dashboard API with the correct parameters', async () => {
		const uid = 'abc123';
		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue({ status: 'success' })
		} as any);

		const result = await deleteDashboardOnGrafana(uid);

		expect(global.fetch).toHaveBeenCalledWith(`${GRAFANA_URL}/api/dashboards/uid/${uid}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			}
		});
		expect(result).toEqual({ status: 'success' });
	});
});

describe('callGrafanaFolderApi', () => {
	it('should call the Grafana folder API with the correct parameters', async () => {
		const grafanaJSON = '{"title":"My Folder"}';
		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue({ status: 'success' })
		} as any);

		const result = await callGrafanaFolderApi(grafanaJSON);

		expect(global.fetch).toHaveBeenCalledWith(`${GRAFANA_URL}/api/folders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			},
			body: grafanaJSON
		});
		expect(result).toEqual({ status: 'success' });
	});
});

import { createGrafanaFolder } from './grafanaHandler';

describe('createGrafanaFolder', () => {
	it('should create a Grafana folder for the given user', async () => {
		const user = {
			id: '123',
			email: 'test@example.com'
		};

		const payload = await createGrafanaFolderPayload(user.id, user.email);

		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue({ status: 'success' })
		} as any);

		await createGrafanaFolder(user as any);

		expect(global.fetch).toHaveBeenCalledWith(`${GRAFANA_URL}/api/folders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			},
			body: JSON.stringify(payload)
		});
	});
});

export const getGrafanaDashboardJSON = async (uid: string): Promise<any> => {
	console.log(`Calling ${GRAFANA_URL}/api/dashboards/uid/${uid};`);
	const response = await fetch(`${GRAFANA_URL}/api/dashboards/uid/${uid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: GRAFANA_API_TOKEN
		}
	});

	const resp = await response.json();
	console.log(resp);
	return resp;
};

describe('getGrafanaDashboardJSON', () => {
	it('it should retrieve the dashboard Grafana JSON with the passed uid', async () => {
		const uid = 'abc123';

		const expected = { dashboard: { id: 123, title: 'My Dashboard' } };

		global.fetch = mockFn().mockResolvedValue({
			json: mockFn().mockResolvedValue(JSON.stringify(expected))
		} as any);

		await getGrafanaDashboardJSON(uid);

		expect(global.fetch).toHaveBeenCalledWith(`${GRAFANA_URL}/api/dashboards/uid/${uid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: GRAFANA_API_TOKEN
			}
		});
	});
});
