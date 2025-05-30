import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCurrentUser, updateUser } from '../services/api';

export const ProfilePage = () => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Получение актуальных данных пользователя
  const { data: currentUser, isLoading, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Мутация для обновления профиля
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setSuccess('Данные успешно обновлены');
      setError('');
      setEdit(false);
      refetch();
    },
    onError: () => {
      setError('Ошибка при обновлении профиля');
      setSuccess('');
    },
  });

  // Мутация для смены пароля
  const updatePasswordMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setSuccess('Пароль успешно изменён');
      setError('');
      setOldPassword('');
      setNewPassword('');
    },
    onError: () => {
      setError('Ошибка при смене пароля');
      setSuccess('');
    },
  });

  const handleSave = () => {
    setSaving(true);
    updateUserMutation.mutate({ name, address });
    setSaving(false);
  };

  const handleChangePassword = () => {
    updatePasswordMutation.mutate({ old_password: oldPassword, new_password: newPassword });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, mb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Профиль
      </Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Личные данные
          </Typography>
          <IconButton onClick={() => setEdit(!edit)}>
            {edit ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <TextField
          label="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <TextField
          label="Email"
          value={email}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Адрес доставки"
          value={address}
          onChange={e => setAddress(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        {edit && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 700, background: '#FF6900', color: '#fff', borderRadius: 3, textTransform: 'none' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        )}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Сменить пароль
        </Typography>
        <TextField
          label="Старый пароль"
          type={showPassword ? 'text' : 'password'}
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(v => !v)}>
                  <LockIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Новый пароль"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 2, fontWeight: 700, borderRadius: 3, textTransform: 'none' }}
          disabled={!oldPassword || !newPassword}
          onClick={handleChangePassword}
        >
          Сменить пароль
        </Button>
      </Paper>
    </Box>
  );
}; 