import type { Panel } from '@prisma/client';

export function addPanel(
	panel: {
		title: string;
		JSON: {
			description: string;
		};
		thumbnailPath: string;
	},
	panelForm: any[]
) {
	panelForm = [
		...panelForm,
		{
			id: (panelForm.length + 1).toString(),
			name: `${panel.title}`,
			description: panel.JSON.description || 'No description provided',
			thumbnailPath: panel.thumbnailPath,
			grafanaJSON: {
				...panel.JSON,
				id: panelForm.length + 1
			},
			grafanaUrl: null,
			position: panelForm.length + 1,
			width: 1,
			createdAt: null,
			updatedAt: null,
			dashboardId: ''
		}
	];

    return panelForm;
}

export function removePanel(panelId: string, panelForm: any[]) {
	panelForm = panelForm.filter((panel) => panel.id !== panelId);
    return panelForm;
}

export function dragPanel(ev: { target: { id: string } }, draggedPanel: Panel, panelForm: any[]) {
	draggedPanel = panelForm.find((panel) => String(panel.position) === ev?.target?.id) as Panel;
	return draggedPanel;
}

export function dropPanel(
	ev: { target: { id: string } },
	draggedPanel: Panel,
	currentPanel: Panel,
	panelForm: any[]
) {
	currentPanel = panelForm.find((panel) => String(panel.position) === ev?.target?.id) as Panel;

	let draggedPanelIndex = panelForm.findIndex((panel) => panel.position === draggedPanel.position);
	let currentPanelIndex = panelForm.findIndex((panel) => panel.position === currentPanel.position);

	let temp = panelForm[draggedPanelIndex];
	panelForm[draggedPanelIndex] = panelForm[currentPanelIndex];
	panelForm[currentPanelIndex] = temp;

	swapIndexes(panelForm[draggedPanelIndex], draggedPanelIndex);
	swapIndexes(panelForm[currentPanelIndex], currentPanelIndex);
}

function swapIndexes(panel: Panel, index: number) {
	panel.position = index;
}
