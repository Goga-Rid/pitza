import { useState } from 'react';
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../services/api';

interface ReviewFormProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

export const ReviewForm = ({ productId, productName, onClose }: ReviewFormProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () => createReview({ product_id: productId, rating: rating!, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const handleSubmit = () => {
    if (rating) {
      submitReview();
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Оценить {productName}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box>
            <Typography component="legend">Оценка</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            label="Комментарий"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!rating || isPending}
        >
          Отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 