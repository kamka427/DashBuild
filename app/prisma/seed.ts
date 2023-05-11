/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import type { Panel } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { fetchPanels, generateDashboardThumbnail, removeThumbnails } from './utils';

removeThumbnails();

const availablePanels = await fetchPanels();

const prisma = new PrismaClient();
async function main() {
	await prisma.dashboard.deleteMany();
	await prisma.panel.deleteMany();
	await prisma.user.deleteMany();
	await prisma.dashboardIteration.deleteMany();

	await prisma.user.createMany({
		data: {
			id: faker.datatype.uuid(),
			name: 'Admin',
			email: 'admin@admin.com'
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
				id: faker.datatype.uuid(),
				name: panel.title,
				description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
				thumbnailPath: panel.thumbnailPath,
				grafanaJSON: panel.JSON,
				grafanaUrl: null,
				width: Math.floor(Math.random() * columns) + 1,
				position: i + 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				dashboardId: '',
				type: panel.title
			});
		}

		const dashboardTags = [faker.company.bsBuzz(), faker.company.bsBuzz()];

		const dashboardPreview = await generateDashboardThumbnail(panelsOnDash, dashboardName);
		const grafanaObject = {
			dashboard: {
				title: dashboardName,
				panels: panelsOnDash.map((panel) => panel.grafanaJSON),
				tags: dashboardTags
			}
		};

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
					create: panelsOnDash.map((panel) => ({
						id: panel.id,
						name: panel.name,
						description: panel.description,
						thumbnailPath: panel.thumbnailPath,
						grafanaJSON: JSON.parse(JSON.stringify(panel.grafanaJSON)),
						grafanaUrl: panel.grafanaUrl,
						width: panel.width,
						position: panel.position,
						type: panel.type,
						createdAt: panel.createdAt,
						updatedAt: panel.updatedAt
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
