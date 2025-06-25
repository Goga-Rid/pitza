import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewForm } from '../../src/components/ReviewForm';
import { describe, test, expect, vi } from 'vitest';

vi.mock('../../src/services/api', () => ({ createReview: vi.fn() }));
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() })
}));

describe('ReviewForm', () => {
  
  test('клик по "Отмена" вызывает onClose', () => {
    const onClose = vi.fn();
    render(
      <ReviewForm productId={1} productName="Пицца" onClose={onClose} />
    );
    const cancelBtn = screen.getAllByRole('button')[0];
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
    console.info('✅ ReviewForm: onClose вызывается по клику "Отмена"');
  });
});
