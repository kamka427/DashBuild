export type responsePanel = {
    file_name: string;
    json_data: {
        title: string;
    };
};

export type panelEntry = {
    title: string;
    JSON: responsePanel['json_data'];
    thumbnailPath: string;
    fileName: responsePanel['file_name'];
};