import { GRAFANA_URL, GRAFANA_API_TOKEN, PANEL_PARSER_URL } from '$env/static/private';
import type { Dashboard, Panel, User } from '@prisma/client';
import type { panelEntry, responsePanel } from './types';

/**
 * Fetches panels from the panel parser API.
 * @returns An array of panel entries.
 */
export const fetchPanels = async (): Promise<panelEntry[]> => {
    const resp = await fetch(`${PANEL_PARSER_URL}`, {});

    const data = await resp.json();
    console.log(data);

    const panels: panelEntry[] = [];

    data.map((panel: responsePanel) => {
        panels.push({
            title: panel.json_data.title,
            JSON: panel.json_data,
            thumbnailPath: `/thumbnails/${panel.file_name}.png`,
            fileName: panel.file_name,
            properties: panel.config
        });
    });

    return panels;
};

/**
 * Calculates the grid position of a panel based on its position in the dashboard and the number of columns.
 * @param panel - The panel to calculate the grid position for.
 * @param colCount - The number of columns in the dashboard.
 * @returns The grid position of the panel.
 */
export const calculateGridPos = (
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
): { h: number; w: number; x: number; y: number } => {
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
};

/**
 * Creates a Grafana dashboard payload object for the given panel form, title, description, tags, user folder, and existing dashboard.
 * @param panelForm - The panel form to create the dashboard payload for.
 * @param title - The title of the dashboard.
 * @param description - The description of the dashboard.
 * @param tags - The tags for the dashboard.
 * @param userFolder - The user folder for the dashboard.
 * @param existingDashboard - The existing dashboard to update, if any.
 * @returns The Grafana dashboard payload object.
 */
export const createGrafanaDashboardPayload = async (
    panelForm: Panel[],
    title: string,
    description: string,
    tags: string[],
    userFolder: string,
    existingDashboard: Dashboard | null = null
): Promise<{
    dashboard: {
        title: string;
        description: string;
        panels: any[];
        tags: string[];
        uid: string | null;
        version: number;
    };
    folderUid: string;
}> => {
    const grafanaObject = {
        dashboard: {
            title: title,
            description: description,
            panels: panelForm.map((panel) => panel.grafanaJSON),
            tags: tags,
            uid: existingDashboard !== null ? existingDashboard.id : null,
            version: existingDashboard !== null ? existingDashboard.version : 1
        },
        folderUid: userFolder
    };

    return grafanaObject;
};

/**
 * Creates a Grafana folder payload object for the given UID and folder name.
 * @param uid - The UID of the folder.
 * @param folderName - The name of the folder.
 * @returns The Grafana folder payload object.
 */
export const createGrafanaFolderPayload = async (
    uid: string,
    folderName: string
): Promise<{ uid: string; title: string }> => {
    const grafanaObject = {
        uid: uid,
        title: folderName
    };

    return grafanaObject;
};

/**
 * Calls the Grafana dashboard API with the given Grafana JSON payload.
 * @param grafanaJSON - The Grafana JSON payload to send to the API.
 * @returns The response from the API.
 */
export const callGrafanaDashboardApi = async (grafanaJSON: string): Promise<any> => {
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
};

/**
 * Deletes a dashboard from Grafana with the given UID.
 * @param uid - The UID of the dashboard to delete.
 * @returns The response from the API.
 */
export const deleteDashboardOnGrafana = async (uid: string): Promise<any> => {
    const response = await fetch(`${GRAFANA_URL}/api/dashboards/uid/${uid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: GRAFANA_API_TOKEN
        }
    });

    const resp = await response.json();
    console.log(resp);
    return resp;
};

/**
 * Calls the Grafana folder API with the given Grafana JSON payload.
 * @param grafanaJSON - The Grafana JSON payload to send to the API.
 * @returns The response from the API.
 */
export const callGrafanaFolderApi = async (grafanaJSON: string): Promise<any> => {
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
};

/**
 * Creates a Grafana folder for the given user.
 * @param user - The user to create the folder for.
 */
export const createGrafanaFolder = async (user: User): Promise<void> => {
    const folderObject = await createGrafanaFolderPayload(user.id, user.email);
    await callGrafanaFolderApi(JSON.stringify(folderObject));
};