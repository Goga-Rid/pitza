import { render, screen, fireEvent } from '@testing-library/react';
import { AddressModal } from '../../src/components/AddressModal';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutate: vi.fn(), isPending: false }) }));

describe('AddressModal', () => {
  test('рендерит модальное окно и форму', () => {
    render(
      <AddressModal open={true} onClose={() => {}} onSuccess={() => {}} />
    );
    expect(screen.getByText(/укажите адрес/i)).toBeTruthy();
    // Проверяем, что есть две кнопки: закрытия (иконка) и "Сохранить"
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    expect(buttons[1].textContent?.toLowerCase()).toContain('сохранить');
    console.info('✅ AddressModal: модальное окно и форма успешно отображаются');
  });

  test('вызывает onClose при клике по кнопке закрытия', () => {
    const onClose = vi.fn();
    render(
      <AddressModal open={true} onClose={onClose} onSuccess={() => {}} />
    );
    const closeBtn = screen.getAllByRole('button')[0];
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
    console.info('✅ AddressModal: onClose вызывается при клике по кнопке закрытия');
  });
});
