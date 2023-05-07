import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import type { Panel } from '@prisma/client';
const writeFilePromise = promisify(fs.writeFile);

export function generateDashboardThumbnail(panelList: Panel[], dashboardName: string) {
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
			input: `${path.resolve('app', panel.thumbnailPath)}`,
			gravity: locations[index]
		};
	});

	sharp({
		create: {
			width: 1600,
			height: 600,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`${path.resolve('app', '../src/lib/thumbnails')}/${dashboardName}.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
		});

	return `../src/lib/thumbnails/${dashboardName}.png`;
}

export async function updatePanelThumbnailsWithApi(uuidAndSlug: string, panelId: string) {
	const response = await fetch(
		`${GRAFANA_URL}/render/d-solo/${uuidAndSlug}?orgId=1&from=1683393012358&to=1683414612358&panelId=${panelId}&width=500&height=250&tz=Europe%2FBudapest`,
		{
			headers: {
				Authorization: GRAFANA_API_TOKEN
			}
		}
	);

	const buffer = await response.arrayBuffer();

	const buff = await sharp(buffer).jpeg().toBuffer();
	await writeFilePromise(`${path.resolve('app', '../src/lib/thumbnails')}/${panelId}.png`, buff);

	return response;
}
