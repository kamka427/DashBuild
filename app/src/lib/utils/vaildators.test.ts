import { describe, it, expect } from 'vitest';
import { validateForm, validatePublish } from './validators';

describe('validateForm', () => {
	it('should return a fail response if the title is too short', async () => {
		const result = await validateForm('ab', '', 2, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe('ab');
		expect(result?.data?.error).toBe("The dashboard's name should be between 3 and 60 characters");
	});

	it('should return a fail response if the title is too long', async () => {
		const result = await validateForm('a'.repeat(61), '', 2, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe('a'.repeat(61));
		expect(result?.data?.error).toBe("The dashboard's name should be between 3 and 60 characters");
	});
	it('should return a fail response if the description is too long', async () => {
		const result = await validateForm('test', 'a'.repeat(101), 2, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe('a'.repeat(101));
		expect(result?.data?.error).toBe(
			"The dashboard's description should be less than 100 characters"
		);
	});

	it('should return a fail response if the column count is too low', async () => {
		const result = await validateForm('test', '', 0, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe(0);
		expect(result?.data?.error).toBe("The dashboard's column count should be between 1 and 4");
	});

	it('should return a fail response if the column count is too high', async () => {
		const result = await validateForm('test', '', 5, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe(5);
		expect(result?.data?.error).toBe("The dashboard's column count should be between 1 and 4");
	});

	it('should return a fail response if the published state is invalid', async () => {
		const result = await validateForm('test', '', 2, 'invalid', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe('invalid');
		expect(result?.data?.error).toBe('Published should be a boolean');
	});

	it('should return a fail response if there are too many tags', async () => {
		const tags = ['a', 'b', 'c', 'd', 'e', 'f'];
		const result = await validateForm('test', '', 2, 'true', tags, []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toBe(tags);
		expect(result?.data?.error).toBe('You can only have a maximum of 5 tags');
	});

	it('should return a fail response if there are no panels', async () => {
		const result = await validateForm('test', '', 2, 'true', [], []);
		expect(result?.status).toBe(403);
		expect(result?.data?.description).toStrictEqual([]);
		expect(result?.data?.error).toBe('You need to have at least 1 panel');
	});

	it('should not return an error if the form is valid', async () => {
		const title = 'Dashboard';
		const description = '';
		const colCount = 2;
		const published = 'true';
		const tagsList = ['tag1', 'tag2'];
		const panelForm = [{ title: 'Panel 1', grafanaJSON: {}, id: null }] as any;

		const result = await validateForm(title, description, colCount, published, tagsList, panelForm);

		expect(result).toBeUndefined();
	});
});

describe('validatePublish', () => {
	it('should return a fail response if the dashboardId is missing', async () => {
		const result = await validatePublish('', 'true');
		expect(result?.status).toBe(403);
		expect(result?.data?.message).toBe('Missing dashboardId or publishState');
	});

	it('should return a fail response if the publishState is missing', async () => {
		const result = await validatePublish('1', '');
		expect(result?.status).toBe(403);
		expect(result?.data?.message).toBe('Missing dashboardId or publishState');
	});

	it('should return a fail response if the publishState is not "true" or "false"', async () => {
		const result = await validatePublish('1', 'invalid');
		expect(result?.status).toBe(403);
		expect(result?.data?.message).toBe('Invalid publishState');
	});
});
