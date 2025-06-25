import { test, expect } from '@playwright/test';

// Покрытие тестами: регистрация, логин, корзина, избранное, отзывы, защищённые маршруты, фильтры, адаптивность.

const baseUrl = 'http://localhost:5173'; // URL фронтенда
const apiUrl = `${baseUrl}/api`; // URL API (через прокси)

// Тестовые данные (уникальный email для каждого запуска)
const user = {
  email: `e2euser${Date.now()}@example.com`,
  password: 'e2epassword',
  name: 'E2E User',
};
const address = 'г. Москва, ул. Тестовая, д. 1';

// --- Хелперы для регистрации, логина, логаута ---
// Используются для имитации действий пользователя через UI
async function register(page, user) {
  await page.goto(`${apiUrl}/register`);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="name"]', user.name);
  await page.click('button[type="submit"]');
  await expect(page.locator('button, a', { hasText: /выход|logout/i })).toBeVisible();
}

async function login(page, user) {
  await page.goto(`${apiUrl}/login`);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await expect(page.locator('button, a', { hasText: /выход|logout/i })).toBeVisible();
}

async function logout(page) {
  await page.click('button, a:has-text("Выход")');
}

// --- Сброс состояния между тестами ---
// Очищаем localStorage, чтобы каждый тест был независимым
// Это важно для чистоты тестирования

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);
  await page.evaluate(() => localStorage.clear());
});

// === Блок: Аутентификация ===
// Проверка регистрации и логина пользователя через UI

test.describe('Аутентификация', () => {
  test('Регистрация', async ({ page }) => {
    await register(page, user); // регистрация нового пользователя
    await logout(page);         // выход
  });
  test('Логин', async ({ page }) => {
    await login(page, user);    // вход под тем же пользователем
    await logout(page);         // выход
  });
});

// === Блок: Корзина и заказ ===
// Проверка добавления товара в корзину и оформления заказа

test.describe('Корзина и заказ', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, user); // всегда залогинен
  });
  test('Добавление товара в корзину и оформление заказа', async ({ page }) => {
    await page.goto(baseUrl);
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible(); // карточка товара видна
    await firstProduct.locator('button', { hasText: /выбрать|подробнее/i }).click(); // открыть модалку
    await page.getByRole('button', { name: /в корзину/i }).click(); // добавить в корзину
    await page.keyboard.press('Escape'); // закрыть модалку
    await page.click('[aria-label*="корзин"],a[href="/cart"]'); // открыть корзину
    await expect(page.locator('.cart-item, [data-testid="cart-item"]')).toHaveCount(1); // товар в корзине
    await page.getByRole('button', { name: /оформить заказ/i }).click(); // оформить заказ
    await page.fill('input[placeholder*="адрес"]', address); // ввести адрес
    await page.getByRole('button', { name: /сохранить/i }).click(); // подтвердить
    await expect(page.locator('text=успешно')).toBeVisible(); // заказ оформлен
  });
});

// === Блок: Избранное ===
// Проверка добавления и удаления товара из избранного

test.describe('Избранное', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, user);
  });
  test('Добавление и удаление из избранного', async ({ page }) => {
    await page.goto(baseUrl);
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.locator('button[aria-label*="избранн"],svg[aria-label*="избранн"]').click(); // добавить в избранное
    await page.goto(`${baseUrl}/favorites`); // перейти в избранное
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1); // товар в избранном
    await page.locator('[data-testid="product-card"] button[aria-label*="избранн"]').click(); // удалить
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(0); // избранное пусто
  });
});

// === Блок: Отзывы ===
// Проверка добавления отзыва к товару

test.describe('Отзывы', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, user);
  });
  test('Добавление отзыва', async ({ page }) => {
    await page.goto(baseUrl);
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button', { hasText: /подробнее|выбрать/i }).click(); // открыть модалку
    await page.getByRole('button', { name: /оценить|отзыв/i }).click(); // открыть форму отзыва
    await page.locator('input[type="radio"]').first().check(); // выбрать оценку
    await page.fill('textarea, input[aria-label="Комментарий"]', 'Отличная пицца!'); // комментарий
    await page.getByRole('button', { name: /отправить/i }).click(); // отправить
    await expect(page.locator('text=отзыв')).toBeVisible(); // отзыв добавлен
  });
});

// === Блок: Навигация и защищённые маршруты ===
// Проверка, что защищённые страницы требуют авторизации

test.describe('Навигация и защищённые маршруты', () => {
  test('Переходы и редиректы', async ({ page }) => {
    await page.goto(`${baseUrl}/profile`); // попытка зайти в профиль
    await expect(page).toHaveURL(/login/); // редирект на логин
    await page.goto(`${baseUrl}/orders`); // попытка зайти в заказы
    await expect(page).toHaveURL(/login/); // редирект на логин
    await login(page, user); // логинимся
    await page.goto(baseUrl);
    await page.click('a[href="/profile"]'); // теперь профиль доступен
    await expect(page).toHaveURL(/profile/);
  });
});

// === Блок: Фильтры и поиск ===
// Проверка работы фильтров и поиска по товарам

test.describe('Фильтры и поиск', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, user);
  });
  test('Фильтрация и поиск', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole('button', { name: /пиццы/i }).click(); // фильтр по категории
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
    await page.fill('input[placeholder*="поиск"]', 'сыр'); // поиск по названию
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  });
});

// === Блок: Адаптивность (responsive) ===
// Проверка отображения главной страницы на мобильном и десктопе

test.describe('Адаптивность (responsive)', () => {
  test('Главная страница на мобильном устройстве', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone XR
    await page.goto(baseUrl);
    // Проверка наличия мобильного меню-фильтра (бургер)
    await expect(
      page.locator('button[aria-label*="меню"],button[aria-label*="menu"],button[aria-label*="navigation"]')
    ).toBeVisible();
    console.log('✅ Мобильная версия отображается корректно!');
  });

  test('Главная страница на десктопе', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(baseUrl);
    // Проверка наличия навигации для десктопа
    await expect(page.locator('nav')).toBeVisible();
    console.log('✅ Десктопная версия отображается корректно!');
  });
});
