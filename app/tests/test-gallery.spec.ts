import { test, expect } from '@playwright/test';

test('gallery page test', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Sign In' }).click();
	await page.getByPlaceholder('testemail@example.com').click();
	await page.getByPlaceholder('testemail@example.com').fill('user1@dashbuild.com');
	await page.getByRole('button', { name: 'Sign in with Email for testing' }).click();
	await page.getByRole('link', { name: 'Gallery' }).click();
	await page.locator('.card-actions').first().click();
	await page.getByPlaceholder('Search for a dashboard').click();
	await page.getByPlaceholder('Search for a dashboard').fill('testtest');
	await page.locator('div').filter({ hasText: 'No dashboards found' }).nth(1).click();
	await page.getByRole('link', { name: 'Log Out' }).click();
	await page.getByRole('button', { name: 'Sign out' }).click();
});
