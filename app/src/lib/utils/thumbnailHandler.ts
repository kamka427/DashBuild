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

	sharp({
		create: {
			width: 2010,
			height: 1010,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`static/thumbnails/${uid}_dashboard.png`, (err) => {
			if (err) {
				console.log(err);
			}
		});

	return `/thumbnails/${uid}_dashboard.png`;
}

export async function copyDefaultThumbnail(
	uid: string,
	panelId: string,
	defaultThumbnailPath: string
) {
	fs.copyFile(
		`${path.resolve(`static/${defaultThumbnailPath}`)}`,
		`${path.resolve(`static/thumbnails/${uid}_${panelId}.png`)}`,
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);

	return `/thumbnails/${uid}_${panelId}.png`;
}

export async function updatePanelThumbnailsWithApi(uidAndSlug: string, panelId: string) {
	console.log(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${panelId}&width=1000&height=500`
	);
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${panelId}&width=1000&height=500`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
			,mode: 'cors'
		},
	
	);

	const buffer = await response.arrayBuffer();

	const buff = await sharp(buffer).jpeg().toBuffer();

	const uid = uidAndSlug.split('/')[0];
	await writeFilePromise(`${path.resolve('app', THUMBNAIL_PATH)}/${uid}_${panelId}.png`, buff);
	console.log(response);

	return response;
}

export async function updateAllThumbnails(uidAndSlug: string, panelList: Panel[]) {
	console.log('Updating all thumbnails');
	const promises = panelList.map(async (panel) => {
		await updatePanelThumbnailsWithApi(uidAndSlug, panel.position.toString());
		return Promise.resolve();
	});

	await Promise.all(promises);
	await generateDashboardThumbnail(panelList, uidAndSlug.split('/')[0]);
	console.log('All thumbnails updated');
}
