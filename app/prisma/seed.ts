/// <reference types="node" />

// Import the PrismaClient and Panel types
import { PrismaClient } from '@prisma/client';
import type { Panel } from '@prisma/client';

// Import the faker library
import { faker } from '@faker-js/faker';

// Import the utility functions
import { fetchPanels, generateDashboardThumbnail, removeThumbnails } from './utils';

// Remove any existing thumbnails
removeThumbnails();

// Fetch the available panels
const availablePanels = await fetchPanels();

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();

// Define the main function
const main = async () => {
	// Delete any existing data
	await prisma.dashboard.deleteMany();
	await prisma.panel.deleteMany();
	await prisma.user.deleteMany();
	await prisma.dashboardIteration.deleteMany();

	// Generate fake users
	const fakeUsers = Array.from({ length: 10 }).map((_, index) => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: `user${index}@dashbuild.com`
	}));

	// Create the fake users
	await prisma.user.createMany({
		data: fakeUsers
	});

	// Generate a random number of dashboards
	for (let i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
		// Generate a random dashboard name
		const dashboardName = faker.company.buzzPhrase();

		// Generate a random number of columns
		const columns = Math.floor(Math.random() * 4) + 1;

		// Generate a random number of panels for the dashboard
		const panelsOnDash: Panel[] = [];
		for (let i = 0; i < Math.floor(Math.random() * 6) + 1; i++) {
			// Select a random panel from the available panels
			const panel = faker.helpers.arrayElement(availablePanels);

			// Add the panel to the dashboard
			panelsOnDash.push({
				id: faker.string.uuid(),
				name: panel.title,
				description:
					faker.company.buzzPhrase() +
					' ' +
					faker.company.buzzPhrase() +
					' ' +
					faker.company.buzzPhrase(),
				thumbnailPath: panel.thumbnailPath,
				grafanaJSON: panel.JSON,
				grafanaUrl: null,
				width: Math.floor(Math.random() * columns) + 1,
				position: i + 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				dashboardId: '',
				type: panel.title,
				properties: panel.properties
			});
		}

		// Generate random tags for the dashboard
		const dashboardTags = [faker.company.buzzPhrase(), faker.company.buzzPhrase()];

		// Generate a thumbnail for the dashboard
		const dashboardPreview = await generateDashboardThumbnail(panelsOnDash, dashboardName);

		// Generate the Grafana object for the dashboard
		const grafanaObject = {
			dashboard: {
				title: dashboardName,
				panels: panelsOnDash.map((panel) => panel.grafanaJSON),
				tags: dashboardTags
			}
		};

		// Create the dashboard and its associated panels
		await prisma.dashboard.create({
			data: {
				id: faker.string.uuid(),
				name: dashboardName,
				description:
					faker.company.buzzPhrase() +
					' ' +
					faker.company.buzzPhrase() +
					' ' +
					faker.company.buzzPhrase(),
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
						properties: panel.properties as any,
						createdAt: panel.createdAt,
						updatedAt: panel.updatedAt
					}))
				}
			}
		});
	}
};

// Call the main function
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
