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

	await prisma.user.createMany({
		data: {
			id: faker.datatype.uuid(),
			name: 'Admin',
			email: 'admin@admin.com',
			team: 'Admins'
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

	for (let i = 0; i < Math.floor(Math.random() * 35) + 15; i++) {
		await prisma.dashboard.create({
			data: {
				id: faker.datatype.uuid(),
				name: faker.company.bs(),
				description: faker.company.bs() + ' ' + faker.company.bs() + ' ' + faker.company.bs(),
				published: faker.datatype.boolean(),
				tags: [faker.company.bsBuzz(), faker.company.bsBuzz()],
				preview: faker.helpers.arrayElement(testDashboardPreviews),
				userId: faker.helpers.arrayElement(fakeUsers).id,
				representation: {},
				panels: {
					create: Array.from({ length: Math.floor(Math.random() * 6) + 1 }).map(() => ({
						panel: {
							create: {
								id: faker.datatype.uuid(),
								name: faker.company.bs(),
								description:
									faker.company.bs() + ' ' + faker.company.bsBuzz() + ' ' + faker.company.bsBuzz(),
								preview: faker.helpers.arrayElement(testPanelPreviews),
								representation: {}
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
