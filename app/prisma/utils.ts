import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import type { Panel } from '@prisma/client';

// Remove any existing thumbnails
export const removeThumbnails = () => {
	// Define the directory where the thumbnails are stored
	const directory = 'static/thumbnails';

	// Read the contents of the directory
	fs.readdir(directory, (err: any, files: any) => {
		if (err) throw err;

		// Filter out any files that contain the word "Panel"
		files = files.filter((file: any) => !file.includes('Panel'));

		// Delete each file in the directory
		for (const file of files) {
			fs.unlink(path.join(directory, file), (err: any) => {
				if (err) throw err;
			});
		}
	});
};

// Fetch the available panels from the server
export const fetchPanels = async () => {
	// Make a GET request to the server to fetch the panels
	const resp = await fetch(`http://localhost:8000`);

	// Parse the response as JSON
	const data = await resp.json();

	// Define the types for the response data
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

	// Map the response data to an array of panel objects
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

// Generate a thumbnail for a dashboard
export const generateDashboardThumbnail = async (panelList: Panel[], dashboardName: string) => {
	// Define the locations for each panel in the thumbnail
	const locations: {
		[key: string]: string;
	} = {
		'0': 'northwest',
		'1': 'northeast',
		'2': 'southwest',
		'3': 'southeast'
	};

	// Select the first four panels from the panel list
	const firstFourPanels = panelList.slice(0, 4);

	// Define the inputs for the thumbnail
	const inputs = firstFourPanels.map((panel, index) => {
		return {
			input: `static/${panel.thumbnailPath}`,
			gravity: locations[index]
		};
	});

	// Filter the dashboard name to remove any invalid characters
	const filteredDashboardName = dashboardName
		.split('')
		.filter((word) => word !== '/')
		.join('')
		.split(' ')
		.join('_');

	// Generate the thumbnail using the Sharp library
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
};
