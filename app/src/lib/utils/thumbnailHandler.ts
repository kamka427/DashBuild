import { GRAFANA_URL, GRAFANA_API_TOKEN, THUMBNAIL_PATH } from '$env/static/private';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import type { Panel } from '@prisma/client';
import { fail } from '@sveltejs/kit';
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

	const thumbnailPath = `${THUMBNAIL_PATH}/${uid}_dashboard.png`;

	const firstFourPanels = panelList.slice(0, 4);
	const inputs = firstFourPanels.map((panel, index) => {
		return {
			input: `${path.resolve('app', panel.thumbnailPath)}`,
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
		.toFile(`${path.resolve('app', thumbnailPath)}`, (err) => {
			if (err) {
				fail(300, {
					message: 'Error generating dashboard thumbnail',
					error: err
				});
			}
		});

	return thumbnailPath;
}

export async function copyDefaultThumbnail(
	uuid: string,
	panelId: string,
	defaultThumbnailPath: string
) {
	const imagePath = `${THUMBNAIL_PATH}/${uuid}_${panelId}.png`;

	fs.copyFile(
		`${path.resolve('app', defaultThumbnailPath)}`,
		`${path.resolve('app', imagePath)}`,
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);

	return imagePath;
}

export async function updatePanelThumbnailsWithApi(uidAndSlug: string, panelId: string) {
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uidAndSlug}?orgId=1&panelId=${panelId}&width=1000&height=500`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
		}
	);

	const buffer = await response.arrayBuffer();

	const buff = await sharp(buffer).jpeg().toBuffer();

	const uid = uidAndSlug.split('/')[0];
	await writeFilePromise(`${path.resolve('app', THUMBNAIL_PATH)}/${uid}_${panelId}.png`, buff);
	return response;
}

export async function updateAllThumbnails(uidAndSlug: string, panelList: Panel[]) {
	const promises = panelList.map(async (panel) => {
		await updatePanelThumbnailsWithApi(uidAndSlug, panel.id.toString());
		return Promise.resolve();
	});

	await Promise.all(promises);
	await generateDashboardThumbnail(panelList, uidAndSlug.split('/')[0]);
}
