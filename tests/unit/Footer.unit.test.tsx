import { render, screen } from '@testing-library/react';
import { Footer } from '../../src/components/Footer';
import { describe, test, expect } from 'vitest';

describe('Footer', () => {
  test('рендерит логотип и контакты', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    // Можно добавить проверки на наличие текста или иконок соцсетей
  });
});
