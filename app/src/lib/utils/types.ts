export type responsePanel = {
	file_name: string;
	json_data: {
		title: string;
		description: string;
		[key: string]: any;
	};
};

export type panelEntry = {
	title: string;
	JSON: responsePanel['json_data'];
	thumbnailPath: string;
	fileName: responsePanel['file_name'];
};
