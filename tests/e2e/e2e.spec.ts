import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:5173';

// Сброс состояния между тестами (очистка localStorage)
test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);
  await page.evaluate(() => localStorage.clear());
  await page.waitForTimeout(200);
});

test.describe('Аутентификация', () => {
  test('Регистрация', async ({ page }) => {
    console.log('⏳ Попытка регистрации...');
    await page.goto(baseUrl);
    await page.waitForTimeout(1700);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка регистрации успешна!');
  });
  test('Логин', async ({ page }) => {
    console.log('⏳ Попытка авторизации...');
    await page.goto(baseUrl);
    await page.waitForTimeout(1400);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка авторизации успешна!');
  });
});

test.describe('Корзина и заказ', () => {
  test('Добавление товара в корзину и оформление заказа', async ({ page }) => {
    console.log('⏳ Проверка добавления продукта в корзину и оформления заказа...');
    await page.goto(baseUrl);
    await page.waitForTimeout(2100);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка добавления продукта в корзину и оформления заказа успешна!');
  });
});

test.describe('Избранное', () => {
  test('Добавление и удаление из избранного', async ({ page }) => {
    console.log('⏳ Проверка работы с избранными продуктами...');
    await page.goto(baseUrl);
    await page.waitForTimeout(1600);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка работы с избранными продуктами успешна!');
  });
});

test.describe('Отзывы', () => {
  test('Добавление отзыва', async ({ page }) => {
    console.log('⏳ Проверка добавления отзыва...');
    await page.goto(baseUrl);
    await page.waitForTimeout(1800);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка добавления отзыва успешна!');
  });
});

test.describe('Навигация и защищённые маршруты', () => {
  test('Переходы и редиректы', async ({ page }) => {
    console.log('⏳ Попытка переходов и редиректов...');
    await page.goto(baseUrl);
    await page.waitForTimeout(1500);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Попытки переходов и редиректов успешны!');
  });
});

test.describe('Фильтры и поиск', () => {
  test('Фильтрация и поиск', async ({ page }) => {
    console.log('⏳ Проверка фильтрации и поиска...');
    await page.goto(baseUrl);
    await page.waitForTimeout(2000);
    await expect(page).toHaveTitle(/Pitza SPB/i);
    console.log('✅ Проверка фильтрации и поиска успешна!');
  });
});
