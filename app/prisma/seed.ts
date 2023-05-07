/// <reference types="node" />
import {  PrismaClient } from '@prisma/client';
import type { Panel } from '@prisma/client';
import { faker } from '@faker-js/faker';
import sharp from 'sharp';
import path from 'path';

export async function fetchPanels() {
	const resp = await fetch(`http://localhost:8000`);

	const data = await resp.json();

	type responsePanel = {
		file_name: string;
		json_data: {
			title: string;
		};
	};

	type panelEntry = {
		title: string;
		JSON: responsePanel['json_data'];
		thumbnailPath: string;
	};

	const panels: panelEntry[] = [];

	data.map((panel: responsePanel) => {
		panels.push({
			title: panel.json_data.title,
			JSON: panel.json_data,
			thumbnailPath: `../src/lib/thumbnails/${panel.file_name}.png`
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
			input: `${path.resolve('app', panel.thumbnailPath)}`,
			gravity: locations[index]
		};
	});

	const data = await sharp({
		create: {
			width: 2010,
			height: 1010,
			channels: 3,
			background: { r: 0, g: 0, b: 0 }
		}
	})
		.composite(inputs)
		.png()
		.toFile(`${path.resolve('app', "../src/lib/thumbnails")}/${dashboardName}.png`, (err, info) => {
			if (err) {
				console.log(err);
			}
			console.log(info);
			console.log(data);
		});

	return `../src/lib/thumbnails/${dashboardName}.png`;
}

const availablePanels = await fetchPanels();

const prisma = new PrismaClient();
async function main() {
	await prisma.panelsOnDashboards.deleteMany();
	await prisma.dashboard.deleteMany();
	await prisma.panel.deleteMany();
	await prisma.user.deleteMany();

	await prisma.user.createMany({
		data: {
			id: faker.datatype.uuid(),
			name: 'Admin',
			email: 'admin@admin.com',
			team: 'Admins',
			role: 'admin'
		}
	});

	const fakeUsers = Array.from({ length: Math.floor(Math.random() * 15) + 5 }).map(() => ({
		id: faker.datatype.uuid(),
		name: faker.name.fullName(),
		email: faker.internet.email(),
		team: faker.company.name()
	}));

	await prisma.user.createMany({
		data: fakeUsers
	});

	for (let i = 0; i < Math.floor(Math.random() * 25) + 15; i++) {
		const dashboardName = faker.company.bs();
		const panelsOnDash: Panel[] = [];
		for (let i = 0; i < Math.floor(Math.random() * 6) + 1; i++) {
			const panel = faker.helpers.arrayElement(availablePanels);
			panelsOnDash.push({
				id: `${i}`,
				name: panel.title,
				description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
				thumbnailPath: panel.thumbnailPath,
				grafanaJSON: panel.JSON,
				grafanaUrl: null,
				width: Math.floor(Math.random() * 4) + 1
			});

			const dashboardPreview = await generateDashboardThumbnail(panelsOnDash, dashboardName);

			await prisma.dashboard.create({
				data: {
					id: faker.datatype.uuid(),
					name: dashboardName,
					description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
					published: faker.datatype.boolean(),
					tags: [faker.company.bsBuzz(), faker.company.bsBuzz()],
					thumbnailPath: dashboardPreview,
					userId: faker.helpers.arrayElement(fakeUsers).id,
					grafanaJSON: {},
					panels: {
						create: panelsOnDash.map((panelElem) => ({
							panel: {
								create: {
									id: faker.datatype.uuid(),
									name: panelElem.name,
									description: panelElem.description,
									thumbnailPath: panelElem.thumbnailPath,
									grafanaJSON: JSON.stringify(panelElem.grafanaJSON),
									grafanaUrl: panelElem.grafanaUrl,
									width: panelElem.width
								}
							}
						}))
					}
				}
			});
		}
	}
	await new Promise((resolve) => setTimeout(resolve, 1000));
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
