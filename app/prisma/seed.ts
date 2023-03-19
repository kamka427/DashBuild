/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const testDashboardPreviews = [
	'../src/lib/placeholders/dash1.png',
	'../src/lib/placeholders/dash2.png',
	'../src/lib/placeholders/dash3.png',
	'../src/lib/placeholders/dash4.png',
	'../src/lib/placeholders/dash5.png',
	'../src/lib/placeholders/dash6.png'
];

const testPanelPreviews = [
	'../src/lib/placeholders/panel1.png',
	'../src/lib/placeholders/panel2.png',
	'../src/lib/placeholders/panel3.png',
	'../src/lib/placeholders/panel4.png'
];

const prisma = new PrismaClient();
async function main() {
	await prisma.panelsOnDashboards.deleteMany();
	await prisma.dashboard.deleteMany();
	await prisma.panel.deleteMany();
	await prisma.user.deleteMany();

	const fakeUsers = Array.from({ length: 10 }).map(() => ({
		id: faker.datatype.uuid(),
		name: faker.name.fullName(),
		email: faker.internet.email(),
		team: 'team' + faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E'])
	}));

	await prisma.user.createMany({
		data: fakeUsers
	});

	const fakeDashboards = Array.from({ length: 10 }).map(() => ({
		id: faker.datatype.uuid(),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		published: faker.datatype.boolean(),
		tags: [
			faker.commerce.productMaterial(),
			faker.commerce.productMaterial(),
			faker.commerce.productMaterial()
		],
		preview: faker.helpers.arrayElement(testDashboardPreviews),
		userId: faker.helpers.arrayElement(fakeUsers).id,
		representation: {}
	}));

	await prisma.dashboard.createMany({
		data: fakeDashboards
	});

	const fakePanels = Array.from({ length: 10 }).map(() => ({
		id: faker.datatype.uuid(),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		preview: faker.helpers.arrayElement(testPanelPreviews),
		representation: {}
	}));

	await prisma.panel.createMany({
		data: fakePanels
	});

	const fakeDashboardPanels = Array.from({ length: 10 }).map(() => ({
		dashboardId: faker.helpers.arrayElement(fakeDashboards).id,
		panelId: faker.helpers.arrayElement(fakePanels).id
	}));

	await prisma.panelsOnDashboards.createMany({
		data: fakeDashboardPanels
	});
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
