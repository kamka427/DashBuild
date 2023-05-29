import { test, expect } from '@playwright/test';

test('test dashboard create', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Sign In' }).click();
	await page.getByPlaceholder('testemail@example.com').click();
	await page.getByPlaceholder('testemail@example.com').fill('user1@dashbuild.com');
	await page.getByPlaceholder('testemail@example.com').press('Enter');
	await page.getByRole('link', { name: 'Create', exact: true }).click();
	await page.getByPlaceholder('Title of the dashboard').click();
	await page.getByPlaceholder('Title of the dashboard').fill('test create');
	await page.getByPlaceholder('Description of the dashboard').click();
	await page.getByPlaceholder('Description of the dashboard').fill('test');
	await page.getByPlaceholder('Tags separated by comma').click();
	await page.getByPlaceholder('Tags separated by comma').fill('test');
	await page.getByRole('figure').locator('path').click();
	await page.getByText('Example Time series').click();
	await page.getByRole('button', { name: 'Save Dashboard' }).click();
	await page.getByText('Dashboard Information Open in Grafana Refresh Thumbnails Publish').click();
	await page.getByRole('button', { name: 'Delete' }).click();
	await page.locator('div').filter({ hasText: 'DashBuild Dashboards' }).nth(1).click();
	await page.getByRole('link', { name: 'Log Out' }).click();
	await page.getByRole('button', { name: 'Sign out' }).click();
});
