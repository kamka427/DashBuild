import { saveDashboardAction } from '$lib/utils/actions';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) =>
		await saveDashboardAction(request, locals, url)
};
