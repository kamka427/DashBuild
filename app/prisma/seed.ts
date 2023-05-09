/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import type { Panel } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { fetchPanels, generateDashboardThumbnail, removeThumbnails } from './utils';

removeThumbnails();

const availablePanels = await fetchPanels();

const prisma = new PrismaClient();
async function main() {
	await prisma.panelsOnDashboards.deleteMany();
	await prisma.dashboard.deleteMany();
	await prisma.panel.deleteMany();
	await prisma.user.deleteMany();
	await prisma.dashboardIteration.deleteMany();

	await prisma.user.createMany({
		data: {
			id: faker.datatype.uuid(),
			name: 'Admin',
			email: 'admin@admin.com',
			role: 'admin'
		}
	});

	const fakeUsers = Array.from({ length: Math.floor(Math.random() * 15) + 5 }).map(() => ({
		id: faker.datatype.uuid(),
		name: faker.name.fullName(),
		email: faker.internet.email()
	}));

	await prisma.user.createMany({
		data: fakeUsers
	});

	for (let i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
		const dashboardName = faker.company.bs();

		const panelsOnDash: Panel[] = [];
		const columns = Math.floor(Math.random() * 4) + 1;
		for (let i = 0; i < Math.floor(Math.random() * 6) + 1; i++) {
			const panel = faker.helpers.arrayElement(availablePanels);
			panelsOnDash.push({
				id: `${i}`,
				name: panel.title,
				description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
				thumbnailPath: panel.thumbnailPath,
				grafanaJSON: panel.JSON,
				grafanaUrl: null,
				width: Math.floor(Math.random() * columns) + 1,
				position: i,
				createdAt: null,
				updatedAt: null
			});
		}

		const dashboardTags = [faker.company.bsBuzz(), faker.company.bsBuzz()];

		const dashboardPreview = await generateDashboardThumbnail(panelsOnDash, dashboardName);
		const grafanaObject = {dashboard: {
			title: dashboardName,
			panels: panelsOnDash.map((panel) => panel.grafanaJSON),
			tags: dashboardTags,
		}};

		await prisma.dashboard.create({
			data: {
				id: faker.datatype.uuid(),
				name: dashboardName,
				description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
				published: faker.datatype.boolean(),
				tags: dashboardTags,
				thumbnailPath: dashboardPreview,
				userId: faker.helpers.arrayElement(fakeUsers).id,
				grafanaJSON: grafanaObject,
				columns: columns,
				panels: {
					create: panelsOnDash.map((panelElem) => ({
						panel: {
							create: {
								id: faker.datatype.uuid(),
								name: panelElem.name,
								description: panelElem.description,
								thumbnailPath: panelElem.thumbnailPath,
								grafanaJSON: JSON.parse(JSON.stringify(panelElem.grafanaJSON)),
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
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
