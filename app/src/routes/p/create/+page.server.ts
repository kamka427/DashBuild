import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import { GRAFANA_URL, GRAFANA_API_TOKEN } from '$env/static/private';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	return {
		panels: prisma.panel.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				preview: true,
				representation: true
			},
			orderBy: {
				name: 'asc'
			}
		}),
		GRAFANA_URL: GRAFANA_URL,
		GRAFANA_API_TOKEN: GRAFANA_API_TOKEN
	};
};
