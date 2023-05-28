import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import type { Panel } from '@prisma/client';
const writeFilePromise = promisify(fs.writeFile);

/**
 * Generates a dashboard thumbnail image by compositing the thumbnails of the first four panels in the panel list.
 * @param uid - The unique identifier of the dashboard.
 * @param panelList - The list of panels in the dashboard.
 */
export async function generateDashboardThumbnail(uid: string, panelList: Panel[]) {
	// Define the locations of the first four panels in the thumbnail
	const locations: {
		[key: string]: string;
	} = {
		0: 'northwest',
		1: 'northeast',
		2: 'southwest',
		3: 'southeast'
	};

	// Get the first four panels in the panel list
	const firstFourPanels = panelList.slice(0, 4);

	// Define the inputs for the composite image
	const inputs = firstFourPanels.map((panel, index) => {
		return {
			input: `${path.resolve(`static/${panel.thumbnailPath}`)}`,
			gravity: locations[index]
		};
	});

	try {
		// Create a new image with a black background and composite the panel thumbnails onto it
		await sharp({
			create: {
				width: 2010,
				height: 1010,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 255 }
			}
		})
			.composite(inputs)
			.png()
			.toFile(`static/thumbnails/${uid}_dashboard.png`, (err) => {
				if (err) {
					console.log(err);
				}
			});
	} catch (err) {
		console.log(err);
	}
}

/**
 * Copies the default thumbnail image to the specified position and returns the path to the new thumbnail.
 * @param uid - The unique identifier of the dashboard.
 * @param position - The position of the panel in the dashboard.
 * @param thumbailPath - The path to the default thumbnail image.
 * @returns The path to the new thumbnail image.
 */
export async function copyDefaultThumbnail(uid: string, position: number, thumbailPath: string) {
	try {
		// Copy the default thumbnail image to the specified position
		fs.copyFileSync(
			`${path.resolve(`static/${thumbailPath}`)}`,
			`${path.resolve(`static/thumbnails/${uid}_${position}.png`)}`
		);
	} catch (err) {
		console.log(err);
	}
	return `/thumbnails/${uid}_${position}.png`;
}

/**
 * Updates the thumbnail image for the specified panel using the Grafana API.
 * @param uidAndSlug - The unique identifier and slug of the dashboard.
 * @param position - The position of the panel in the dashboard.
 * @returns The response from the Grafana API.
 */
export async function updatePanelThumbnailsWithApi(uidAndSlug: string, position: string) {
	// Call the Grafana API to get the panel image
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${position}&width=1000&height=500`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
		}
	);
	console.log(
		'Calling',
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${position}&width=1000&height=500`
	);

	// Convert the response to a buffer and save it as a PNG file
	const buffer = await response.arrayBuffer();
	const sharpBuff = await sharp(buffer).png().toBuffer();
	const uid = uidAndSlug.split('/')[0];
	await writeFilePromise(`static/thumbnails/${uid}_${position}.png`, sharpBuff);
	return response;
}

/**
 * Updates the thumbnail images for all panels in the dashboard using the Grafana API.
 * @param uidAndSlug - The unique identifier and slug of the dashboard.
 * @param panelList - The list of panels in the dashboard.
 */
export async function updateAllThumbnails(uidAndSlug: string, panelList: Panel[]) {
	// Update the thumbnail image for each panel in the panel list
	const promises = panelList.map(async (panel) => {
		await updatePanelThumbnailsWithApi(uidAndSlug, panel.position.toString());
		return Promise.resolve();
	});

	await Promise.all(promises);

	// Generate the dashboard thumbnail image
	await generateDashboardThumbnail(uidAndSlug.split('/')[0], panelList);
}

/**
 * Initializes the thumbnail images and paths for all panels in the dashboard.
 * @param uid - The unique identifier of the dashboard.
 * @param panelList - The list of panels in the dashboard.
 */
export async function initThumbnailsAndPaths(uid: string, panelList: Panel[]) {
	// Copy the default thumbnail image to each panel and update the thumbnail path
	const promises = panelList.map(async (panel: Panel) => {
		await copyDefaultThumbnail(uid, panel.position, panel.thumbnailPath);
		panel.thumbnailPath = `thumbnails/${uid}_${panel.position}.png`;
		Promise.resolve();
	});
	await Promise.all(promises);

	// Generate the dashboard thumbnail image
	await generateDashboardThumbnail(uid, panelList);
}
