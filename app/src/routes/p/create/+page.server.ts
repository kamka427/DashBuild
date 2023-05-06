import type { PageServerLoad, Actions } from './$types';
import type { Dashboard, Panel } from '@prisma/client';
import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';
import fs from 'fs';
import path from 'path';
import { panelTemplates } from '$lib/configs/panelTemplates.json';
import { prisma } from '$lib/prisma';
import sharp from 'sharp';
import dashboardTemplate from '$lib/configs/dashboardTemplate.json';

function mapPythonToJSON(panelString: string) {
	const panelObject = {};
	const panelLines = panelString.split('\n');
	panelLines.forEach((line: string) => {
		const lineSplit = line.split('=');
		if (lineSplit.length > 1) {
			const key = lineSplit[0].trim();
			const value = lineSplit[1].trim().replace(/[,()]/g, '');
			panelObject[key] = value;
		}
	});
	const firstKey = Object.keys(panelObject)[0];
	panelObject['type'] = panelObject[firstKey].toLowerCase();
	delete panelObject[firstKey];

	const panelTemplate = panelTemplates[panelObject['type']];
	Object.keys(panelObject).forEach((key) => {
		if (panelTemplate[key]) {
			panelTemplate[key] = panelObject[key].replace(/['"]+/g, '');
		} else if (panelTemplate['fieldConfig']['defaults']['custom'][key]) {
			//add loop nester
			panelTemplate['fieldConfig']['defaults']['custom'][key] = panelObject[key].replace(
				/['"]+/g,
				''
			);
		}
	});

	return panelTemplate;
}

function mapJSONToPython(panelObject: any) {
	let panelString = '';
	panelString += `${panelObject.type} = {\n`;
	Object.keys(panelObject).forEach((key) => {
		if (key !== 'type') {
			panelString += `\t${key}: ${panelObject[key]},\n`;
		}
	});
	panelString += '}\n';
	return panelString;
}

function loadPredefinedPythonPanels() {
	const panels: any[] = [];
	const panelsPath = path.join(process.cwd(), 'src', 'lib', 'pythonPanels');
	fs.readdirSync(panelsPath).forEach((file) => {
		if (file.endsWith('.py')) {
			const panelString = fs.readFileSync(path.join(panelsPath, file), 'utf8');
			const panelObject = mapPythonToJSON(panelString);

			const panelEntry = {
				name: panelObject.title,
				JSON: panelObject,
				Python: panelString,
				thumbnail: `../src/lib/pythonPanels/${file.replace('.py', '')}.png`
			};
			panels.push(panelEntry);
		}
	});

	return panels;
}
function loadPredefinedJSONPanels() {
	const panels: any[] = [];
	const panelsPath = path.join(process.cwd(), 'src', 'lib', 'jsonPanels');
	fs.readdirSync(panelsPath).forEach((file) => {
		if (file.endsWith('.json')) {
			const panel = JSON.parse(fs.readFileSync(path.join(panelsPath, file), 'utf8'));

			const panelEntry = {
				name: panel.title,
				JSON: panel,
				Python: mapJSONToPython(panel),
				thumbnail: `../src/lib/jsonPanels/${file.replace('.json', '')}.png`
			};

			panels.push(panelEntry);
		}
	});

	return panels;
}

function combinePredefinedPanels() {
	const pythonPanels = loadPredefinedPythonPanels();
	const jsonPanels = loadPredefinedJSONPanels();
	return [...pythonPanels, ...jsonPanels];
}

export const load: PageServerLoad = async () => {
	return {
		panels: prisma.panel.findMany({
			orderBy: {
				name: 'asc'
			}
		}),
		GRAFANA_URL: GRAFANA_URL,
		GRAFANA_API_TOKEN: GRAFANA_API_TOKEN,
		predefinedPanels: combinePredefinedPanels()
	};
};

function generateUuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function generateDashboardThumbnail(panelList, dashboardName) {
	const locations = {
		'0': 'northwest',
		'1': 'northeast',
		'2': 'southwest',
		'3': 'southeast'
	};

	const onlytofour = panelList.slice(0, 4);
	const inputs = onlytofour.map((panel, index) => {
		console.log(panel);
		return {
			input: `${path.resolve('app', panel.thumbnailPath)}`,
			gravity: locations[index]
		};
	});

	sharp({
		create: {
			width: 1600,
			height: 800,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 1 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`thumbnails/${dashboardName}.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
		});
}

async function createGrafanaPayload(panelForm: Panel[], dashboardName: string) {
	let grafanaPayload = {
		dashboard: {
			...dashboardTemplate,
			title: dashboardName,
			panels: panelForm.map((panel) => panel.grafanaJSON)
		}
	};

	return grafanaPayload;
}

async function callGrafanaApi(grafanaJSON: JSON) {
	const response = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: GRAFANA_API_TOKEN
		},
		body: JSON.stringify(grafanaJSON)
	});

	const data = await response.json();
	console.log(data);
}

export const actions: Actions = {
	saveDashboard: async (event) => {
		const { dashboardName, dashboardDescription, colCount, tags, published, panelForm } =
			Object.fromEntries(await event.request.formData()) as unknown as {
				dashboardName: string;
				dashboardDescription: string;
				colCount: number;
				tags: string[];
				teamName: string;
				published: boolean;
				panelForm: string;
			};

		let panelFormJSON = JSON.parse(panelForm);
		generateDashboardThumbnail(panelFormJSON, dashboardName);

		console.log(panelFormJSON);

		const session = await event.locals.getSession();

		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: session?.user?.email as string
			}
		});

		await prisma.dashboard.create({
			data: {
				id: generateUuid(),
				name: dashboardName,
				description: dashboardDescription,
				published: Boolean(published),
				tags: tags,
				thumbnailPath: path.join(process.cwd(), '..', 'thumbnails', `${dashboardName}.png') `),
				grafanaJSON: {},
				pythonCode: '',
				columns: Number(colCount),
				grafanaUrl: '',
				userId: user.id,
				panels: {
					create: panelFormJSON.map((panelElem: Panel) => ({
						panel: {
							create: {
								id: generateUuid(),
								name: panelElem.name,
								description: panelElem.description,
								thumbnailPath: panelElem.thumbnailPath,
								grafanaJSON: panelElem.grafanaJSON,
								pythonCode: panelElem.pythonCode,
								grafanaUrl: panelElem.grafanaUrl,
								width: panelElem.width
							}
						}
					}))
				}
			}
		});

		let grafanaPayload = await createGrafanaPayload(panelFormJSON, dashboardName);
		await callGrafanaApi(grafanaPayload);
		return {
			status: 200,
			body: {
				message: 'Dashboard saved'
			}
		};
	}
};
