import type { PageServerLoad, Actions } from './$types';
import { PrismaClient } from '@prisma/client';
import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { panelTemplates } from '$lib/configs/panelTemplates.json';
import mergeImages from 'merge-images';
const prisma = new PrismaClient();

function mapPythonToJSON(panelString) {
	const panelObject = {};
	const panelLines = panelString.split('\n');
	panelLines.forEach((line) => {
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
				thumbnail: `../src/lib/pythonPanels/${file.replace('.py', '')}.png`
			}
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
				thumbnail: `../src/lib/jsonPanels/${file.replace('.json', '')}.png`
			}

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

function generateDashboardThumbnail(panelList) {
	const panelPromises = panelList.map((panel) => {
		return mergeImages([panel.thumbnail, { x: 0, y: 0 }]);
	});
	return Promise.all(panelPromises).then((images) => {
		return mergeImages(images, {
			width: 800,
			height: 600,
			quality: 1
		});
	});
}


export const load: PageServerLoad = async () => {
	return {
		panels: prisma.panel.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				preview: true,
				representation: true
			},
			orderBy: {
				name: 'asc'
			}
		}),
		GRAFANA_URL: GRAFANA_URL,
		GRAFANA_API_TOKEN: GRAFANA_API_TOKEN,
		predefinedPanels: combinePredefinedPanels()
	};
};

export const actions: Actions = {
	saveDashboard: async ({ request }) => {
		const { name, published, tags, teamName, panels } = Object.fromEntries(
			await request.formData()
		) as unknown as {
			name: string;
			published: boolean;
			tags: string;
			teamName: string;
			panels: any;
		};
		try {
			await prisma.dashboard.create({
				data: {
					name: name,
					description: '',
					published: published,
					tags: tags,
					preview: '',
					representation: {},
					user: {
						connect: {
							team: teamName
						}
					},
					panels: panels
				}
			});
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'Could not create dashboard' });
		}
	}
};
