/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import {faker} from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  const fakeUsers = Array.from({ length: 10 }).map(() => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    team: "team" + faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
  }));
  await prisma.user.createMany({
    data: fakeUsers,
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
