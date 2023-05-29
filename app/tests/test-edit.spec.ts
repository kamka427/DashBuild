import { test, expect } from '@playwright/test';

test('dashboard edit test', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Sign In' }).click();
	await page.getByPlaceholder('testemail@example.com').click();
	await page.getByPlaceholder('testemail@example.com').fill('user1@dashbuild.com');
	await page.getByRole('button', { name: 'Sign in with Email for testing' }).click();
	await page.getByRole('link', { name: 'Create', exact: true }).click();
	await page.getByPlaceholder('Title of the dashboard').click();
	await page.getByPlaceholder('Title of the dashboard').fill('edittest');
	await page.getByRole('figure').getByRole('img').click();
	await page
		.getByRole('listitem')
		.filter({ hasText: 'Example Time series' })
		.getByRole('img', { name: 'Panel thumbnail' })
		.click();
	await page.getByRole('button', { name: 'Save Dashboard' }).click();
	await page.getByText('Dashboard Information Open in Grafana Refresh Thumbnails Publish').click();
	await page.getByRole('link', { name: 'Edit' }).click();
	await page.getByRole('img').nth(2).click();
	await page
		.getByRole('listitem')
		.filter({ hasText: 'Example Bar gauge' })
		.getByRole('img', { name: 'Panel thumbnail' })
		.click();
	await page.getByRole('button', { name: 'Save Dashboard' }).click();
	await page.getByText('2', { exact: true }).click();
	await page.getByRole('button', { name: 'Delete' }).click();
	await page.locator('div').filter({ hasText: 'DashBuild Dashboards' }).nth(1).click();
	await page.getByRole('link', { name: 'Log Out' }).click();
	await page.getByRole('button', { name: 'Sign out' }).click();
});
