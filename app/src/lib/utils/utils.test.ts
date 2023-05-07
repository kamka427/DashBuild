import { describe, it, expect } from 'vitest';
import { calculateGridPos, createGrafanaPayload } from '$lib/utils/grafanaHandler';

describe('calculateGridPos', () => {
	it('calculates gridPos', () => {
		const panel = {
			id: '0',
			grafanaJSON: {
				gridPos: {
					h: 0,
					w: 0,
					x: 0,
					y: 0
				}
			}
		};

		const colCount = 2;

		const gridPos = calculateGridPos(panel, colCount);

		expect(gridPos).toEqual({
			h: 9,
			w: 12,
			x: 0,
			y: 0
		});

		const panel2 = {
			id: '1',
			grafanaJSON: {
				gridPos: {
					h: 0,
					w: 0,
					x: 0,
					y: 0
				}
			}
		};

		const gridPos2 = calculateGridPos(panel2, colCount);

		expect(gridPos2).toEqual({
			h: 9,
			w: 12,
			x: 12,
			y: 0
		});

		const panel3 = {
			id: '2',
			grafanaJSON: {
				gridPos: {
					h: 0,
					w: 0,
					x: 0,
					y: 0
				}
			}
		};

		const gridPos3 = calculateGridPos(panel3, colCount);

		expect(gridPos3).toEqual({
			h: 9,
			w: 12,
			x: 0,
			y: 9
		});
	});
});


