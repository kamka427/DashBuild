import { fetchPanels } from '$lib/utils/grafanaHandler';
import type { PageServerLoad } from '../../$types';

/**
 * Loads the predefined panels for the dashboard editor page.
 * @returns An object containing the predefined panels.
 */
export const load: PageServerLoad = async () => {
	return {
		predefinedPanels: fetchPanels()
	};
};
