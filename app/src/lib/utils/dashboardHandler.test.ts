import { generateTags } from './dashboardHandler';
import { describe, it, expect } from 'vitest';

describe('generateTags', () => {
	it('should split a comma-separated string of tags into an array of trimmed strings', () => {
		const tags = 'tag1, tag2, tag3';
		const expected = ['tag1', 'tag2', 'tag3'];

		const result = generateTags(tags);

		expect(result).toEqual(expected);
	});

	it('should handle leading/trailing spaces and extra commas', () => {
		const tags = '  tag1  , tag2,, tag3  ';
		const expected = ['tag1', 'tag2', 'tag3'];

		const result = generateTags(tags);

		expect(result).toEqual(expected);
	});

	it('should return an empty array if the input is empty', () => {
		const tags = '';
		const expected: string[] = [];

		const result = generateTags(tags);

		expect(result).toEqual(expected);
	});
});

import { generatePanelFormJSON } from './dashboardHandler';

describe('generatePanelFormJSON', () => {
	it('should generate panel form JSON with correct properties and grid positions', () => {
		const panelForm =
			'[{"title":"Panel 1","grafanaJSON":{"type":"graph"},"id":null,"width": 1},{"title":"Panel 2","grafanaJSON":{"type":"table"},"id":null,"width": 1}]';
		const colCount = 2;
		const expected = [
			{
				title: 'Panel 1',
				grafanaJSON: {
					type: 'graph',
					gridPos: { x: 0, y: 0, w: 12, h: 9 },
					id: 1
				},
				width: 1,
				id: 1,
				position: 1
			},
			{
				title: 'Panel 2',
				grafanaJSON: {
					type: 'table',
					gridPos: { x: 12, y: 0, w: 12, h: 9 },
					id: 2
				},
				width: 1,
				id: 2,
				position: 2
			}
		];

		const result = generatePanelFormJSON(panelForm, colCount);

		expect(result).toEqual(expected);
	});

	it('should handle empty panel form', () => {
		const panelForm = '[]';
		const colCount = 2;
		const expected: any[] = [];

		const result = generatePanelFormJSON(panelForm, colCount);

		expect(result).toEqual(expected);
	});
});

import { getUidAndSlug } from './dashboardHandler';

describe('getUidAndSlug', () => {
	it('should concatenate the uid and slug with a slash', () => {
		const input = { uid: '123', slug: 'test' };
		const expected = '123/test';

		const result = getUidAndSlug(input);

		expect(result).toEqual(expected);
	});
});
