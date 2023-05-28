import { calculateGridPos } from './grafanaHandler';
import type { Dashboard, Panel, User } from '@prisma/client';
import { GRAFANA_URL } from '$env/static/private';
import { prisma } from './prisma';

/**
 * Generates an array of tags from a comma-separated string of tags.
 * @param tags - A comma-separated string of tags.
 * @returns An array of tags.
 */
export const generateTags = (tags: string): string[] => tags.split(',').map((tag) => tag.trim());

/**
 * Generates a JSON object from a stringified JSON object, and adds position and ID properties to each panel.
 * @param panelForm - A stringified JSON object representing a list of panels.
 * @param colCount - The number of columns in the dashboard grid.
 * @returns A JSON object representing a list of panels, with position and ID properties added to each panel.
 */
export const generatePanelFormJSON = (panelForm: string, colCount: number): Panel[] => {
    let panelFormJSON = JSON.parse(panelForm);
    console.log(panelFormJSON);
    panelFormJSON = panelFormJSON.map(
        (panel: Panel & { grafanaJSON: any; id: any }, index: number) => {
            panel.position = index + 1;
            panel.id = index + 1;
            return {
                ...panel,
                grafanaJSON: {
                    ...panel.grafanaJSON,
                    gridPos: calculateGridPos(panel, Number(colCount)),
                    id: index + 1
                }
            };
        }
    );
    return panelFormJSON;
};

/**
 * Upserts a dashboard and its associated panels to the database.
 * @param resp - An object containing the UID, URL, and version of the dashboard.
 * @param dashboardName - The name of the dashboard.
 * @param dashboardDescription - The description of the dashboard.
 * @param published - A string representing whether the dashboard is published or not.
 * @param tags - A comma-separated string of tags for the dashboard.
 * @param grafanaObject - A JSON object representing the dashboard in Grafana.
 * @param colCount - The number of columns in the dashboard grid.
 * @param user - The user object associated with the dashboard.
 * @param panelList - An array of panel objects associated with the dashboard.
 */
export const upsertDashboardQuery = async (
    resp: { uid: string; url: string; version: number },
    dashboardName: string,
    dashboardDescription: string,
    published: string,
    tags: string,
    grafanaObject: object,
    colCount: number,
    user: User,
    panelList: any
): Promise<void> => {
    const parsedPublished = published === 'true' ? true : false;

    await prisma.dashboard.upsert({
        where: {
            id: resp.uid
        },
        create: {
            id: resp.uid,
            name: dashboardName,
            description: dashboardDescription,
            published: parsedPublished,
            tags: tags,
            thumbnailPath: `/thumbnails/${resp.uid}_dashboard.png`,
            grafanaJSON: grafanaObject,
            columns: Number(colCount),
            grafanaUrl: `${GRAFANA_URL}${resp.url}`,
            version: resp.version,
            dashboardIterations: {
                create: {
                    id: `${resp.uid}-${resp.version}`,
                    version: resp.version,
                    grafanaJSON: grafanaObject
                }
            },
            userId: user.id,
            panels: {
                create: panelList.map((panelElem: Panel) => ({
                    id: `${resp.uid}-${panelElem.position}`,
                    name: panelElem.name,
                    description: panelElem.description,
                    thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
                    grafanaJSON: panelElem.grafanaJSON,
                    grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
                    width: panelElem.width,
                    position: panelElem.position,
                    type: panelElem.type,
                    properties: panelElem.properties
                }))
            }
        },
        update: {
            id: resp.uid,
            name: dashboardName,
            description: dashboardDescription,
            published: Boolean(published),
            tags: tags,
            thumbnailPath: `/thumbnails/${resp.uid}_dashboard.png`,
            grafanaJSON: grafanaObject,
            columns: Number(colCount),
            grafanaUrl: `${GRAFANA_URL}${resp.url}`,
            version: resp.version,
            dashboardIterations: {
                create: {
                    id: `${resp.uid}-${resp.version}`,
                    version: resp.version,
                    grafanaJSON: grafanaObject
                }
            },
            userId: user.id,
            panels: {
                deleteMany: {
                    id: {
                        notIn: panelList.map((panelElem: Panel) => `${resp.uid}-${panelElem.position}`)
                    }
                },
                upsert: panelList.map((panelElem: Panel) => ({
                    where: {
                        id: `${resp.uid}-${panelElem.position}`
                    },
                    create: {
                        id: `${resp.uid}-${panelElem.position}`,
                        name: panelElem.name,
                        description: panelElem.description,
                        thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
                        grafanaJSON: panelElem.grafanaJSON,
                        grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
                        width: panelElem.width,
                        position: panelElem.position,
                        type: panelElem.type,
                        properties: panelElem.properties
                    },
                    update: {
                        id: `${resp.uid}-${panelElem.position}`,
                        name: panelElem.name,
                        description: panelElem.description,
                        thumbnailPath: `/thumbnails/${resp.uid}_${panelElem.position}.png`,
                        grafanaJSON: panelElem.grafanaJSON,
                        grafanaUrl: `${GRAFANA_URL}${resp.url}?orgId=1&viewPanel=${panelElem.id}`,
                        width: panelElem.width,
                        position: panelElem.position,
                        type: panelElem.type,
                        properties: panelElem.properties
                    }
                }))
            }
        }
    });
};

/**
 * Returns a string containing the UID and slug of a dashboard.
 * @param resp - An object containing the UID and slug of the dashboard.
 * @returns A string containing the UID and slug of the dashboard.
 */
export const getUidAndSlug = (resp: { uid: string; slug: string }): string => resp.uid + '/' + resp.slug;

/**
 * Queries the database for an existing dashboard and its associated panels.
 * @param sessionUser - The ID of the user associated with the dashboard.
 * @param dashboardId - The ID of the dashboard to query for. If null, returns null for the dashboardExists property.
 * @returns An object containing the dashboardExists property (an object representing the dashboard and its associated panels) and the user object associated with the dashboard.
 */
export const queryExistingDashboard = async (
    sessionUser: string,
    dashboardId: string | null = null
): Promise<{
    dashboardExists: any;
    user: User & {
        dashboards: Dashboard[];
    };
}> => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: sessionUser
        },
        include: {
            dashboards: true
        }
    });

    if (dashboardId !== null) {
        const dashboardExists = await prisma.dashboard.findFirst({
            where: {
                userId: user.id,
                id: dashboardId
            },
            include: {
                panels: true
            }
        });
        return { dashboardExists, user };
    }
    return { dashboardExists: null, user };
};