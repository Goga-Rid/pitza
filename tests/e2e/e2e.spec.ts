import { test, expect } from '@playwright/test';

test('главная страница открывается', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/Pitza SPB/i);
  await expect(page.getByText('Меню')).toBeVisible({ timeout: 5000 });
}); 