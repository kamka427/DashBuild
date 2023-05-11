import { saveDashboardAction } from '$lib/utils/formActions';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	saveDashboard: async ({ request, locals, url }) => await saveDashboardAction(request, locals, url)
};
