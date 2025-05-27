import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../services/api';

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddressModal = ({ open, onClose, onSuccess }: AddressModalProps) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const { mutate: saveAddress, isPending } = useMutation({
    mutationFn: () => updateUser({ address }),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: () => {
      setError('Не удалось сохранить адрес. Попробуйте еще раз.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Пожалуйста, введите адрес');
      return;
    }
    saveAddress();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Укажите адрес доставки</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Адрес"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            placeholder="Улица, дом, квартира"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending}
            sx={{
              background: '#FF6900',
              borderRadius: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: '#ff8500' },
            }}
          >
            {isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 