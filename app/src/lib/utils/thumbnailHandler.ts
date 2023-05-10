import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import type { Panel } from '@prisma/client';
const writeFilePromise = promisify(fs.writeFile);

export async function generateDashboardThumbnail(panelList: Panel[], uid: string) {
	const locations: {
		[key: string]: string;
	} = {
		1: 'northwest',
		2: 'northeast',
		3: 'southwest',
		4: 'southeast'
	};

	const firstFourPanels = panelList.slice(0, 4);
	const inputs = firstFourPanels.map((panel) => {
		return {
			input: `${path.resolve(`static/${panel.thumbnailPath}`)}`,
			gravity: locations[panel.position]
		};
	});

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
		.toFile(`static/thumbnails/${uid}_dashboard.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
		});

	console.log('Thumbnail generated');
	return `/thumbnails/${uid}_dashboard.png`;
}

export async function copyDefaultThumbnail(
	uid: string,
	position: number,
	defaultThumbnailPath: string
) {
	fs.copyFile(
		`${path.resolve(`static/${defaultThumbnailPath}`)}`,
		`${path.resolve(`static/thumbnails/${uid}_${position}.png`)}`,
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);
	return `/thumbnails/${uid}_${position}.png`;
}

export async function updatePanelThumbnailsWithApi(uidAndSlug: string, position: string) {
	console.log(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${position}&width=1000&height=500`
	);
	console.log('start', position);
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${position}&width=1000&height=500`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
		}
	);
	const buffer = await response.arrayBuffer();
	const sharpBuff = await sharp(buffer).png().toBuffer();
	const uid = uidAndSlug.split('/')[0];
	await writeFilePromise(`static/thumbnails/${uid}_${position}.png`, sharpBuff);
	return response;
}

export async function updateAllThumbnails(uidAndSlug: string, panelList: Panel[]) {
	console.log('Updating all thumbnails');
	const promises = panelList.map(async (panel) => {
		console.log(`Updating thumbnail for panel ${panel.position}`);
		await updatePanelThumbnailsWithApi(uidAndSlug, panel.position.toString());
		return Promise.resolve();
	});

	await Promise.all(promises);
	await generateDashboardThumbnail(panelList, uidAndSlug.split('/')[0]);
}

export async function initThumbnailsAndPaths(panelFormJSON: any, resp: any) {
	const promises = panelFormJSON.map(async (panel: Panel) => {
		await copyDefaultThumbnail(resp.uid, panel.position, panel.thumbnailPath);
		panel.thumbnailPath = `thumbnails/${resp.uid}_${panel.position}.png`;
		Promise.resolve();
	});
	await Promise.all(promises);
	const thumbnailPath = await generateDashboardThumbnail(panelFormJSON, resp.uid);
	return thumbnailPath;
}
