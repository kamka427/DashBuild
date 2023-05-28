import type { Panel } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { prisma } from './prisma';

/**
 * Validates the form data for creating or updating a dashboard.
 * @param title - The title of the dashboard.
 * @param description - The description of the dashboard.
 * @param colCount - The number of columns in the dashboard.
 * @param published - The published state of the dashboard.
 * @param tagsList - The list of tags for the dashboard.
 * @param panelForm - The list of panels for the dashboard.
 * @returns A fail response if the form data is invalid, otherwise nothing.
 */
export const validateForm = async (
    title: string,
    description: string,
    colCount: number,
    published: string,
    tagsList: string[],
    panelForm: Panel[]
) => {
    if (title.length < 3 || title.length > 50) {
        return fail(403, {
            description: title,
            error: "The dashboard's name should be between 3 and 60 characters"
        });
    }

    if (description.length > 100) {
        return fail(403, {
            description: description,
            error: "The dashboard's description should be less than 100 characters"
        });
    }

    if (colCount < 1 || colCount > 4) {
        return fail(403, {
            description: colCount,
            error: "The dashboard's column count should be between 1 and 4"
        });
    }

    if (published !== 'true' && published !== 'false') {
        return fail(403, { description: published, error: 'Published should be a boolean' });
    }

    if (tagsList.length > 0) {
        if (tagsList.length > 5) {
            return fail(403, {
                description: tagsList,
                error: 'You can only have a maximum of 5 tags'
            });
        }
    }

    if (panelForm.length < 1) {
        return fail(403, {
            description: panelForm,
            error: 'You need to have at least 1 panel'
        });
    }
};

/**
 * Validates the publish state of a dashboard.
 * @param dashboardId - The ID of the dashboard.
 * @param publishState - The publish state of the dashboard.
 * @returns A fail response if the publish state is invalid, otherwise nothing.
 */
export const validatePublish = async (dashboardId: string, publishState: string) => {
    if (!dashboardId || !publishState) {
        return fail(403, { message: 'Missing dashboardId or publishState' });
    }

    if (publishState !== 'true' && publishState !== 'false') {
        return fail(403, { message: 'Invalid publishState' });
    }

    if (publishState === 'true') {
        const dashboard = await prisma.dashboard.findUniqueOrThrow({
            where: {
                id: dashboardId
            }
        });

        if (!dashboard) {
            return fail(403, { message: 'Dashboard not found' });
        }

        if (dashboard.published) {
            return fail(403, { message: 'Dashboard already published' });
        }
    }
};

/**
 * Checks if the user has permission to access a dashboard.
 * @param locals - The SvelteKit locals object.
 * @param dashboardId - The ID of the dashboard.
 * @param errorMessage - The error message to display if the user does not have permission.
 * @throws An error with the specified error message if the user does not have permission.
 */
export const permissionCheck = async (
    locals: App.Locals,
    dashboardId: string,
    errorMessage: string
) => {
    const session = await locals.getSession();

    const userId = session?.user.id;

    const dashboard = await prisma.dashboard.findUniqueOrThrow({
        where: {
            id: dashboardId
        },
        include: {
            user: true
        }
    });

    if (dashboard.user.id !== userId) {
        throw error(403, errorMessage);
    }
};