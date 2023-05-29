import { test, expect } from '@playwright/test';

test('auth test', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Sign In' }).click();
	await page.getByPlaceholder('testemail@example.com').click();
	await page.getByPlaceholder('testemail@example.com').fill('user1@dashbuild.com');
	await page.getByRole('button', { name: 'Sign in with Email for testing' }).click();
	await page
		.getByText('Welcome to DashBuild Build. Dashboards. Easily. Welcome to our new web app, wher')
		.click();
	await page.getByRole('link', { name: 'Log Out' }).click();
	await page.getByRole('button', { name: 'Sign out' }).click();
});
