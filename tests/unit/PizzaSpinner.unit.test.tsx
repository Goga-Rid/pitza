import { render } from '@testing-library/react';
import { PizzaSpinner } from '../../src/components/PizzaSpinner';
import { describe, test, expect } from 'vitest';

describe('PizzaSpinner', () => {
  test('рендерит svg спиннер', () => {
    const { getByAltText } = render(<PizzaSpinner />);
    expect(getByAltText('Pizza spinner')).toBeTruthy();
    console.info('✅ PizzaSpinner: svg спиннер успешно отображается');
  });
});
