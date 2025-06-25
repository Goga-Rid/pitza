import { render, screen, fireEvent } from '@testing-library/react';
import { MenuFilters } from '../../src/components/MenuFilters';
import { describe, test, expect, vi } from 'vitest';

describe('MenuFilters', () => {
  test('рендерит фильтры и поиск', () => {
    const setSearchTerm = vi.fn();
    const setSelectedCategory = vi.fn();
    render(
      <MenuFilters
        searchTerm=""
        setSearchTerm={setSearchTerm}
        selectedCategory="Все"
        setSelectedCategory={setSelectedCategory}
      />
    );
    // Проверяем, что есть кнопка поиска и кнопки категорий
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
    expect(screen.getByText(/все/i)).toBeTruthy();
    expect(screen.getByText(/пиццы/i)).toBeTruthy();
    expect(screen.getByText(/комбо/i)).toBeTruthy();
    expect(screen.getByText(/десерты/i)).toBeTruthy();
    expect(screen.getByText(/напитки/i)).toBeTruthy();
    expect(screen.getByText(/закуски/i)).toBeTruthy();
    console.info('✅ MenuFilters: фильтры и поиск успешно отображаются');
  });
});
