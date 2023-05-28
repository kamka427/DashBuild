/**
 * Defines the typing of the JSON data for a panel response.
 */
export type responsePanel = {
	file_name: string;
	json_data: {
		title: string;
		description: string;
		[key: string]: any;
	};
	config: {
		[key: string]: any;
	};
};

/**
 * Defines the typing of a panel entry in the dashboard.
 */
export type panelEntry = {
	title: string; // The title of the panel.
	JSON: responsePanel['json_data']; // The JSON data for the panel.
	thumbnailPath: string; // The path to the thumbnail image for the panel.
	fileName: responsePanel['file_name']; // The file name of the panel.
	properties: responsePanel['config']; // The configuration properties for the panel.
};
