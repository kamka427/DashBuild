import type { LayoutServerLoad } from './$types';

/**
 * Loads the session data for the layout.
 * @param event The event object containing the session data.
 * @returns An object containing the session data.
 */
export const load: LayoutServerLoad = async (event) => {
	return {
		session: await event.locals.getSession()
	};
};
