import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByPlaceholder('testemail@example.com').click();
  await page.getByPlaceholder('testemail@example.com').fill('admin@admin.com');
  await page.getByRole('button', { name: 'Sign in with Email for testing' }).click();
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.getByPlaceholder('Title of the dashboard').click();
  await page.getByPlaceholder('Title of the dashboard').fill('asdf');
  await page.getByRole('figure').getByRole('button').click();
  await page.getByRole('button', { name: 'Test Panel' }).click();
  await page.getByRole('button').nth(2).click();
  await page.getByRole('button', { name: 'Panel Title' }).click();
  await page.getByRole('button', { name: 'Save Dashboard' }).click();
  await page.getByText('asdf test desc DELETE Edit Copy Refresh').click();
  await page.getByRole('link', { name: 'Log Out' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
});