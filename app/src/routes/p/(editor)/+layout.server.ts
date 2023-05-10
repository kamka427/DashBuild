import { fetchPanels } from '$lib/utils/grafanaHandler';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async () => {
	return {
		predefinedPanels: fetchPanels()
	};
};
