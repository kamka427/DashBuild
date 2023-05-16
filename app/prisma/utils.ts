import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import type { Panel } from '@prisma/client';

export function removeThumbnails() {
	const directory = 'static/thumbnails';

	fs.readdir(directory, (err: any, files: any) => {
		if (err) throw err;

		files = files.filter((file: any) => !file.includes('Panel'));
		for (const file of files) {
			fs.unlink(path.join(directory, file), (err: any) => {
				if (err) throw err;
			});
		}
	});
}

export async function fetchPanels() {
	const resp = await fetch(`http://localhost:8000`);

	const data = await resp.json();

	 type responsePanel = {
		file_name: string;
		json_data: {
			title: string;
			description: string;
			[key: string]: any;
		};
		config: {
			[key: string]: any;
		};
	};
	
	 type panelEntry = {
		title: string;
		JSON: responsePanel['json_data'];
		thumbnailPath: string;
		fileName: responsePanel['file_name'];
		properties: responsePanel['config'];
	};
	

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
}

export async function generateDashboardThumbnail(panelList: Panel[], dashboardName: string) {
	const locations: {
		[key: string]: string;
	} = {
		'0': 'northwest',
		'1': 'northeast',
		'2': 'southwest',
		'3': 'southeast'
	};

	const firstFourPanels = panelList.slice(0, 4);
	const inputs = firstFourPanels.map((panel, index) => {
		return {
			input: `static/${panel.thumbnailPath}`,
			gravity: locations[index]
		};
	});

	const filteredDashboardName = dashboardName
		.split('')
		.filter((word) => word !== '/')
		.join('')
		.split(' ')
		.join('_');

	sharp({
		create: {
			width: 2010,
			height: 1010,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 255 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`static/thumbnails/seeder_${filteredDashboardName}.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
		});

	return `/thumbnails/seeder_${filteredDashboardName}.png`;
}
